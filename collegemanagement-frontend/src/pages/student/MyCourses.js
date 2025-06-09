import React, { useEffect, useState } from "react";
import { getAllCourses } from "../../api/course";
import Loading from "../../components/Loading";
import { useAuth } from "../../auth/AuthContext";

const MyCourses = () => {
  const { auth } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await getAllCourses(auth.token);
      // Filtering logic should be adjusted as per backend data structure
      setCourses(all.filter((c) => c.students && c.students.includes(auth.name)));
      setLoading(false);
    })();
    // eslint-disable-next-line
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <h3>My Courses</h3>
      <ul>
        {courses.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyCourses;