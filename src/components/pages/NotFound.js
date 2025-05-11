import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem", color: "var(--primary-color)" }}>404</h1>
        <h2 style={{ marginBottom: "2rem" }}>Page Not Found</h2>
        <p style={{ marginBottom: "2rem" }}>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
