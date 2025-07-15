import Header from "@/components/Header";
import UserProfile from "@/components/UserProfile";
import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay sesión activa");
      setLoading(false);
      return;
    }
    fetch("http://localhost:5000/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          setUser({
            id: data.user.id,
            name: data.user.username,
            username: data.user.username,
            avatar: data.user.avatar,
            bio: data.user.bio,
            followersCount: data.user.followersCount || 0,
            followingCount: data.user.followingCount || 0,
            pinsCount: data.user.pinsCount || 0
          });
        } else {
          setError("No se pudo obtener el perfil");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error al obtener el perfil");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando perfil...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <UserProfile user={user} isOwnProfile={true} />
      </main>
    </div>
  );
};

export default Profile;