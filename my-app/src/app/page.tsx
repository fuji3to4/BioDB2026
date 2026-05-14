import { redirect } from "next/navigation";
import { EXAMPLE_SEARCH_PATH } from "@/lib/routes";

export default function Home() {
  redirect(EXAMPLE_SEARCH_PATH);
}
