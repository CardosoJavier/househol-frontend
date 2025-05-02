// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { createClient } from "../../utils/supabase/component";
import { Session } from "@supabase/supabase-js";
import { ColumnsProvider } from "../../context/ColumnsContext";

export default function ProtectedRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading) return;
  if (!session) return <Navigate to="/auth/login" replace />;

  return (
    <ColumnsProvider>
      <Outlet />
    </ColumnsProvider>
  );
}
