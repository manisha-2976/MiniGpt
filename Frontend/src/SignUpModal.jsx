import { useForm } from "react-hook-form";

const SignUpModal = ({ isOpen, onClose, openLogin, fetchUser }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
        try {
            console.log(data);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/signup`, 
              {
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
            const message = err.response?.data?.message;
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
        <h2 className="modal-title">Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
        <div className="form-input">

          <div>
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
          <div>
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
          <div>
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
          <div>
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

        </div>

        {/* Buttons */}
        <div className="btn">
          <button type="submit" className="primary-btn">
            Sign Up
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={openLogin}
          >
            Back to Login
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default SignUpModal;