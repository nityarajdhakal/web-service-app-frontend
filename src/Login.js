import { useMutation } from "@tanstack/react-query";
import { Loader2, Menu } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../features/auth/authSlice"; 
import axios from "axios";
import { useEffect, useState } from "react";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [lang, setLang] = useState("en");
  const [texts, setTexts] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    
    axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/translations?page=login&lang=${lang}`)
      .then(res => {
        if (res.data && res.data.data) setTexts(res.data.data);
      })
      .catch(err => console.error(err));
  }, [lang]);

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`,
        loginData
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(texts.loginSuccess || "Login successful!");
        dispatch(setToken({ token: data.accessToken, user: data.data }));
        
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/pricelist");
      } else {
        toast.error(data.message || "Login failed");
      }
      reset();
    },
    onError: (error) => {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "User login failed.";
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data) {
    mutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute top-4 left-4">
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="menu"
        >
          <Menu />
        </button>
        {menuOpen && (
          <div className="mt-2 p-3 bg-white shadow rounded">
            <a className="block py-1" href="#">{lang === 'en' ? 'Home' : 'Hem'}</a>
            <a className="block py-1" href="#">{lang === 'en' ? 'Help' : 'Hjälp'}</a>
          </div>
        )}
      </div>

      <div
        className="max-w-md w-full p-6 rounded-lg shadow-lg relative"
        style={{
          backgroundImage: "url('https://storage.123fakturera.se/public/wallpapers/sverige43.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <img src="https://storage.123fakturera.se/public/icons/diamond.png" alt="logo" className="h-12" />
          <div className="flex items-center gap-2">
            <img src="https://storage.123fakturere.no/public/flags/GB.png" alt="EN" className={`h-6 cursor-pointer ${lang==='en'?'opacity-100':'opacity-60'}`} onClick={()=>setLang('en')} />
            <img src="https://storage.123fakturere.no/public/flags/SE.png" alt="SV" className={`h-6 cursor-pointer ${lang==='sv'?'opacity-100':'opacity-60'}`} onClick={()=>setLang('sv')} />
          </div>
        </div>

        <div className="bg-white bg-opacity-90 p-5 rounded">
          <h2 className="text-xl font-bold mb-1">{texts.title || "Welcome Back!"}</h2>
          <p className="text-gray-500 text-sm mb-4">{texts.subtitle || "Login to continue"}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-gray-500 text-sm">{texts.emailLabel || 'Email'}</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" }
                })}
                type="email"
                placeholder={texts.emailLabel || "Email"}
                className="input input-bordered w-full"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-500 text-sm">{texts.passwordLabel || 'Password'}</label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters long" }
                })}
                type="password"
                placeholder={texts.passwordLabel || "Password"}
                className="input input-bordered w-full"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={mutation.isPending} className="btn btn-primary w-full mt-2">
              {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />...Please wait</> : (texts.loginButton || 'Login')}
            </button>

            <div className="text-center mt-3">
              <Link to="/forgot-password" className="text-sm text-blue-600">{texts.forgot || 'Forgot your password?'}</Link>
            </div>

            <div className="text-center mt-2 text-sm text-gray-600">
              {texts.signup ? texts.signup : "Don't have an account? Sign up"}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
