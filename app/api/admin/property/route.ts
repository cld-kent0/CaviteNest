import getListings from "@/app/actions/getListings";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const listings = await getListings(searchParams);

    return new Response(JSON.stringify(listings), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/property:", error);
    return new Response("Error fetching properties", { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Add logic to create a property using `body`
    return new Response("Property created successfully", { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/property:", error);
    return new Response("Error creating property", { status: 500 });
  }
}
