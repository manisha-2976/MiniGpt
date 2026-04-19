import { useForm } from "react-hook-form";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, openSignup, fetchUser }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
        try {
            console.log(data);
            const res = await fetch("http://localhost:8080/user/login", {
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
            const message = err.response?.data?.message || "Server error";
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
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <h2 className="modal-title">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">

          <div className="form-input">

            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="btn">

            <button type="submit" className="primary-btn">
              Login
            </button>

            <button type="button" onClick={openSignup}>
              Sign Up
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;