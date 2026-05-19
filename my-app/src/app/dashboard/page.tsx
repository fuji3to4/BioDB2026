import { auth, signOut } from "@/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  ShieldCheck,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
        <Card className="w-full max-w-2xl border-gray-200 bg-white shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="border border-emerald-300 bg-emerald-100 text-emerald-700"
              >
                <ShieldCheck className="mr-1 h-4 w-4" />
                Authenticated
              </Badge>

              <div className="rounded-full bg-gray-100 p-3">
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
            </div>

            <div>
              <CardTitle className="text-3xl font-bold tracking-tight text-black">
                ダッシュボード
              </CardTitle>

              <CardDescription className="mt-2 text-gray-500">
                認証済みユーザー専用ページ
              </CardDescription>
            </div>
          </CardHeader>

          <Separator className="bg-gray-200" />

          <CardContent className="space-y-6 pt-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    ログイン中のユーザー
                  </p>

                  <h2 className="text-xl font-semibold text-black">
                    {session?.user?.name}
                  </h2>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-gray-700">
              <p className="leading-relaxed">
                このページは認証されたユーザーのみが閲覧できます。
                <br />
                Proxy によってアクセス制御されています。
              </p>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button
                type="submit"
                variant="destructive"
                className="w-full cursor-pointer text-base font-medium"
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}