import { useRouter } from "next/router";
import { useEffect } from "react";

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", ""));
      const accessToken = params.get("access_token");

      if (accessToken) {
        localStorage.setItem("spotifyAccessToken", accessToken);
        router.push("/"); // Redirect to home or dashboard
      } else {
        console.error("Access token not found");
      }
    }
  }, []);

  return <div>Connecting to Spotify...</div>;
};

export default Callback;
