import { connect } from "@/lib/db";
import University from "@/models/University";
import { IUniversity } from "@/models/University";
import UniversityCard from "../../components/universitiesSearch/UniversityCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SearchParams {
  q?: string;
  degree?: string;
  intake?: string;
}

async function getUniversities(params: SearchParams): Promise<IUniversity[]> {
  try {
    await connect();
    
    const queryConditions: Array<{ [key: string]: unknown }> = [];

    // Search by name, location, or programs
    if (params.q) {
      queryConditions.push(
        { name: { $regex: params.q, $options: "i" } },
        { location: { $regex: params.q, $options: "i" } },
        { "programs.name": { $regex: params.q, $options: "i" } },
        { "programs.degree": { $regex: params.q, $options: "i" } }
      );
    }

    // Build the query
    const mongoQuery: { [key: string]: unknown } = {};
    
    if (queryConditions.length > 0) {
      mongoQuery.$or = queryConditions;
    }

    // Filter by degree
    if (params.degree) {
      mongoQuery["programs.degree"] = { $regex: params.degree, $options: "i" };
    }

    const universities = await University.find(mongoQuery).lean();
    return JSON.parse(JSON.stringify(universities));
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const universities = await getUniversities(params);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">
            Find Universities
          </h1>
          <p className="text-primary-foreground/80">
            {universities.length > 0
              ? `Found ${universities.length} ${universities.length === 1 ? "university" : "universities"}`
              : "No universities found matching your criteria"}
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-12">
        {universities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((university: IUniversity) => (
              <UniversityCard university={university} key={String(university._id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              No Universities Found
            </h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Link href="/">
              <Button>Go Back Home</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
