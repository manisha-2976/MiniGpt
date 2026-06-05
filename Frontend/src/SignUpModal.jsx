import { useForm } from "react-hook-form";

const SignUpModal = ({ isOpen, onClose, openLogin, fetchUser }) => {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/user/signup`, {
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
          aria-label="Close signup dialog"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h2 className="modal-title">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="input">
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            {errors.firstName && (
              <p className="error-text">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="input">
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
            {errors.lastName && (
              <p className="error-text">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="input">
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="input">
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>


          {/* Buttons */}
          <button type="submit" className="modal-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>

          <button
            type="button"
            className="modal-btn"
            onClick={openLogin}
          >
            Back to Login
          </button>
        </form>
      </div >
    </div >
  );
};

export default SignUpModal;