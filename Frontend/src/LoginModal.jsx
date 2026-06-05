import { useForm } from "react-hook-form";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, openSignup, fetchUser }) => {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // send login request
      await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });
      await fetchUser();
      onClose();
    } catch (err) {
      console.log(err);
      const message = err?.message || "Server error";
      console.log("SERVER ERROR:", message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close login dialog"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h2 className="modal-title">Login</h2>


        <form onSubmit={handleSubmit(onSubmit)}>

          {/* EMAIL */}
          <div className="input">
            <input
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required"
              })}
            />
          </div>

          {/* PASSWORD */}
          <div className="input">
            <input
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required"
              })}
            />
          </div>

          {/* BUTTON */}
          <button
            className="modal-btn"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <button type="button" onClick={openSignup} className="modal-btn">
            Sign Up
          </button>

        </form>
        </div>
      </div>
  );
};

export default LoginModal;