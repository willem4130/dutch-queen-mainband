import { HomePage } from "@/components/HomePage";
import { getBandData } from "../../config/config-utils";

// ISR: re-render the homepage with fresh CMS data at most every 5 minutes
export const revalidate = 300;

export default async function Home() {
  const { content, shows, gallery } = await getBandData();
  return <HomePage content={content} shows={shows} gallery={gallery} />;
}
