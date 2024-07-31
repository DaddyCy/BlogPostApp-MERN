import { Link } from "react-router-dom";
import { PiPeaceBold } from "react-icons/pi";

import "./BlogFooter.css";

export default function BlogFooter() {
  return (
    <div id="footer" className="container mt-5">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 ">
            <p className="col-md-4 mb-0 text-body-secondary">© 2024 MeRn BlOg, InC</p>
            <Link className="logoFooter" to="/login">
            <PiPeaceBold />
            </Link>
        </footer>
  </div>
  );
}
