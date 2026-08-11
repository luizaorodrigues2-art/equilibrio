import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export default async function NovoArtigoPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  return <ArticleEditor />;
}
