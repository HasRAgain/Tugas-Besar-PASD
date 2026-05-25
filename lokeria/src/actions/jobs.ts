"use server";

import { createClient } from "@/lib/supabase/server";
import type { JobFilters } from "@/types/database.types";

const ITEMS_PER_PAGE = 12;
const EMPTY_RESULT = { jobs: [], totalCount: 0, totalPages: 1, currentPage: 1 };

const sanitizeLocation = (loc: string | null, country: string | null) => {
  if (!loc) return country || null;
  const lowerLoc = loc.toLowerCase().trim();
  if (["hybrid", "remote", "on-site", "onsite"].includes(lowerLoc)) {
    return country || null;
  }
  return loc;
};

const extractWorkType = (loc: string | null, workType: string | null, title?: string | null, desc?: string | null, role?: string | null) => {
  const textToSearch = `${title || ''} ${desc || ''} ${role || ''}`.toLowerCase();
  if (textToSearch.includes("intern") || textToSearch.includes("internship")) {
    return "Intern";
  }

  if (workType) return workType;
  if (!loc) return null;
  const lowerLoc = loc.toLowerCase().trim();
  if (["hybrid", "remote", "on-site", "onsite"].includes(lowerLoc)) {
    if (lowerLoc === "on-site" || lowerLoc === "onsite") return "On-site";
    return loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase();
  }
  return null;
};

const formatText = (text: string | null) => {
  if (!text) return text;
  // Replace literal '\n' or '\\n' with actual newline
  return text.replace(/\\+n/g, '\n');
};

const parseSemanticText = (text: string | null) => {
  if (!text) return { description: null, qualifications: null, responsibilities: null, skills: null, benefits: null };
  
  if (!text.includes("Job Title:") && !text.includes("Job Description:") && !text.includes("Skills:")) {
    return { description: formatText(text), qualifications: null, responsibilities: null, skills: null, benefits: null };
  }

  const markers = [
    { key: "job_title", label: "Job Title:" },
    { key: "role", label: "Role:" },
    { key: "description", label: "Job Description:" },
    { key: "qualifications", label: "Qualifications:" },
    { key: "responsibilities", label: "Responsibilities:" },
    { key: "skills", label: "Skills:" },
    { key: "benefits", label: "Benefits:" }
  ];

  const result: Record<string, string | null> = {
    job_title: null,
    role: null,
    description: null,
    qualifications: null,
    responsibilities: null,
    skills: null,
    benefits: null
  };

  const positions: { key: string, index: number, length: number }[] = [];
  markers.forEach(marker => {
    const idx = text.indexOf(marker.label);
    if (idx !== -1) {
      positions.push({ key: marker.key, index: idx, length: marker.label.length });
    }
  });

  positions.sort((a, b) => a.index - b.index);

  for (let i = 0; i < positions.length; i++) {
    const current = positions[i];
    const next = positions[i + 1];
    
    const start = current.index + current.length;
    const end = next ? next.index : text.length;
    
    const content = text.slice(start, end).trim();
    result[current.key] = content;
  }

  if (!result.description) {
    if (result.role && result.role.length > 5) {
      result.description = result.role;
    } else if (result.job_title && result.job_title.length > 5) {
      result.description = result.job_title;
    } else {
      result.description = text.substring(0, 200) + "...";
    }
  }

  return {
    description: formatText(result.description),
    qualifications: formatText(result.qualifications),
    responsibilities: formatText(result.responsibilities),
    skills: formatText(result.skills),
    benefits: formatText(result.benefits)
  };
};

const DUMMY_COMPANIES = [
  "TechNova Solutions", "Apex Innovations", "Quantum Dynamics", "Nebula Systems", 
  "Vertex Technologies", "Zenith Corp", "Omega Enterprises", "Nimbus Tech",
  "AeroSoft Inc.", "Lumina Networks", "Starlight Systems", "Pinnacle Data",
  "Vanguard Tech", "Aurora Digital", "Cygnus Software", "Orion Group",
  "Stratos Innovations", "Nexus Technologies", "Horizon Digital", "Echo Systems",
  "Cascade Tech", "Solstice Software", "NovaLink", "Equinox Solutions",
  "Meridian Tech", "Oasis Digital", "Pulse Innovations", "Crest Systems",
  "Summit Technologies", "Hyperion Group"
];

const getCompanyName = (cName: string | null, companyObj: any, jobId: string | number) => {
  let name = cName;
  if (!name && companyObj) {
    name = typeof companyObj === "string" ? companyObj : companyObj.name;
  }
  if (!name || name.trim() === "" || name.trim().toLowerCase() === "unknown company") {
    const idStr = String(jobId);
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % DUMMY_COMPANIES.length;
    return DUMMY_COMPANIES[index];
  }
  return name;
};

export async function getJobs(filters: JobFilters = {}) {
  try {
    const supabase = await createClient();
    const page = filters.page || 1;
    const perPage = filters.per_page || ITEMS_PER_PAGE;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // 1. Search Query Validation (Requirement 1)
    if (filters.query) {
      const q = filters.query.trim();
      const isOneChar = q.length <= 1;
      const isNumbersOrSymbolsOnly = /^[^a-zA-Z]+$/.test(q);

      if (!q || isOneChar || isNumbersOrSymbolsOnly) {
        return EMPTY_RESULT;
      }
    }

    let query = supabase
      .from("jobs")
      .select("*, company:companies(*)", { count: "exact" })
      .eq("is_active", true)
      .order("job_posting_date", { ascending: false })
      .range(from, to);

    // Apply text search
    if (filters.query) {
      query = query.or(
        `title.ilike.%${filters.query}%,job_description.ilike.%${filters.query}%,company.ilike.%${filters.query}%,role.ilike.%${filters.query}%`
      );
    }

    // Apply filters
    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }
    if (filters.country) {
      query = query.ilike("country", `%${filters.country}%`);
    }
    if (filters.work_type) {
      if (filters.work_type.toUpperCase() === "INTERN") {
        query = query.or(`work_type.ilike.%intern%,title.ilike.%intern%,job_description.ilike.%intern%,role.ilike.%intern%`);
      } else {
        query = query.ilike("work_type", `%${filters.work_type}%`);
      }
    }
    if (filters.min_salary) {
      query = query.gte("min_salary", filters.min_salary);
    }
    if (filters.max_salary) {
      query = query.lte("max_salary", filters.max_salary);
    }
    if (filters.role) {
      query = query.ilike("role", `%${filters.role}%`);
    }
    if (filters.min_experience_years !== undefined) {
      query = query.lte("min_experience_years", filters.min_experience_years);
    }
    if (filters.max_experience_years !== undefined) {
      query = query.gte("max_experience_years", filters.max_experience_years);
    }

    const { data, error, count } = await query;

    if (error) {
      return EMPTY_RESULT;
    }

    // 2. Similarity Search Fallback (Requirement 3)
    if (filters.query && (!data || data.length === 0)) {
      try {
        const { generateEmbedding } = await import("@/lib/embeddings");
        const queryEmbedding = await generateEmbedding(filters.query);
        const { data: recommendations, error: recError } = await supabase.rpc(
          "match_jobs_for_user",
          {
            query_embedding: queryEmbedding,
            match_count: perPage * 10,
          }
        );

        if (!recError && recommendations && recommendations.length > 0) {
          const validRecs = recommendations.filter((rec: any) => {
            const cName = rec.company;
            return !!cName && cName.trim() !== "" && cName.trim().toLowerCase() !== "unknown company";
          });
          const similarJobs = validRecs.slice(0, perPage).map((rec: any) => {
            const parsed = parseSemanticText(rec.semantic_text);
            return {
              id: String(rec.id),
              title: rec.job_title,
              role: rec.role,
              company_name: rec.company,
              location: sanitizeLocation(rec.location, rec.country),
              work_type: extractWorkType(rec.location, null, rec.job_title, rec.semantic_text, rec.role),
              country: rec.country,
              min_salary: rec.min_salary_usd,
              max_salary: rec.max_salary_usd,
              description: parsed.description,
              qualifications: parsed.qualifications,
              responsibilities: parsed.responsibilities,
              skills: parsed.skills,
              benefits: parsed.benefits,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
          });

          return {
            jobs: similarJobs,
            totalCount: similarJobs.length,
            totalPages: 1,
            currentPage: page,
          };
        }
      } catch (err) {
        console.error("Similarity search failed:", err);
      }
    }

    const mappedData = data?.map((job: any) => {
      let cName = job.company_name;
      if (!cName) {
        cName = typeof job.company === 'string' ? job.company : job.company?.name;
      }
      
      const rawDesc = job.description || job.job_description;
      const parsed = parseSemanticText(rawDesc);
      
      return {
        ...job,
        description: parsed.description,
        qualifications: formatText(job.qualifications) || parsed.qualifications,
        responsibilities: formatText(job.responsibilities) || parsed.responsibilities,
        skills: formatText(job.skills) || parsed.skills,
        benefits: formatText(job.benefits) || parsed.benefits,
        company_name: getCompanyName(cName, job.company, job.id),
        location: sanitizeLocation(job.location, job.country),
        work_type: extractWorkType(job.location, job.work_type, job.title, rawDesc, job.role),
      };
    });

    return {
      jobs: mappedData || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / perPage),
      currentPage: page,
    };
  } catch {
    // Supabase credentials not set or network error
    return EMPTY_RESULT;
  }
}

export async function getJobById(jobId: string) {
  try {
    const supabase = await createClient();

    let { data, error } = await supabase
      .from("jobs")
      .select("*, company:companies(*)")
      .eq("id", jobId)
      .single();

    if (error) {
      if (/^\d+$/.test(jobId)) {
        const { data: embedData, error: embedError } = await supabase
          .from("embedded_jobs")
          .select("*")
          .eq("id", parseInt(jobId, 10))
          .single();
          
        if (!embedError && embedData) {
          // Try to map this AI recommendation to a real job UUID
          let query = supabase
            .from("jobs")
            .select("*, company:companies(*)")
            .eq("title", embedData.job_title);
            
          if (embedData.company) {
            query = query.eq("company_name", embedData.company);
          }

          const { data: realJob } = await query.limit(1).single();

          if (realJob) {
            // Success! We found the real UUID job. Swap the data and clear the error.
            data = realJob;
            // Ensure company name is never lost if the matched real job has it missing
            if (!data.company_name && !data.company) {
              data.company_name = embedData.company;
            }
            error = null as any;
          } else {
            // Fallback to the mock object if we can't find a matching real job
            const parsed = parseSemanticText(embedData.semantic_text);
          return {
            id: String(embedData.id),
            title: embedData.job_title,
            role: embedData.role,
            company_name: getCompanyName(embedData.company, null, embedData.id),
            location: sanitizeLocation(embedData.location, embedData.country),
            work_type: extractWorkType(embedData.location, null, embedData.job_title, embedData.semantic_text, embedData.role),
            country: embedData.country,
            min_salary: embedData.min_salary_usd,
            max_salary: embedData.max_salary_usd,
            description: parsed.description,
            qualifications: parsed.qualifications,
            responsibilities: parsed.responsibilities,
            skills: parsed.skills,
            benefits: parsed.benefits,
            is_active: true,
          };
        }
        }
      }
      if (error) return null;
    }
    
    let cName = data.company_name;
    if (!cName) {
      cName = typeof data.company === 'string' ? data.company : data.company?.name;
    }

    const rawDesc = data.description || data.job_description;
    const parsed = parseSemanticText(rawDesc);
    
    return {
      ...data,
      description: parsed.description,
      qualifications: formatText(data.qualifications) || parsed.qualifications,
      responsibilities: formatText(data.responsibilities) || parsed.responsibilities,
      skills: formatText(data.skills) || parsed.skills,
      benefits: formatText(data.benefits) || parsed.benefits,
      company_name: getCompanyName(data.company_name, data.company, data.id),
      location: sanitizeLocation(data.location, data.country),
      work_type: extractWorkType(data.location, data.work_type, data.title, rawDesc, data.role),
    };
  } catch {
    return null;
  }
}

export async function getFeaturedJobs() {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from("jobs")
      .select("*, company:companies(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(30);

    return (data || []).map((job: any) => {
      let cName = job.company_name;
      if (!cName) {
        cName = typeof job.company === 'string' ? job.company : job.company?.name;
      }
      
      const rawDesc = job.description || job.job_description;
      const parsed = parseSemanticText(rawDesc);
      
      return {
        ...job,
        description: parsed.description,
        qualifications: formatText(job.qualifications) || parsed.qualifications,
        responsibilities: formatText(job.responsibilities) || parsed.responsibilities,
        skills: formatText(job.skills) || parsed.skills,
        benefits: formatText(job.benefits) || parsed.benefits,
        company_name: getCompanyName(cName, job.company, job.id),
        location: sanitizeLocation(job.location, job.country),
        work_type: extractWorkType(job.location, job.work_type, job.title, rawDesc, job.role),
      };
    });
  } catch {
    return [];
  }
}
