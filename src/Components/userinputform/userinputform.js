import React, { useState } from "react";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";


const queryClient = new QueryClient();


function UserInputForm() {
 const [formData, setFormData] = useState({
   firstname: "",
   lastname: "",
   gender: "",
   age: "",
   familyHistory: "",
 });


 const mutation = useMutation((newUser) => axios.post("http://localhost:5000/api/users", newUser));


 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData((prev) => ({
     ...prev,
     [name]: value,
   }));
 };


 const handleSubmit = (e) => {
   e.preventDefault();
   mutation.mutate(formData, {
     onSuccess: () => {
       alert("User submitted successfully!");
     },
     onError: () => {
       alert("Error submitting the form");
     },
   });
 };


 return (
   <form onSubmit={handleSubmit}>
     <label>First Name*</label>
     <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} />


     <label>Last Name*</label>
     <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />


     <label>Gender</label>
     <input
       type="radio"
       name="gender"
       value="male"
       checked={formData.gender === "male"}
       onChange={handleChange}
     />{" "}
     Male
     <input
       type="radio"
       name="gender"
       value="female"
       checked={formData.gender === "female"}
       onChange={handleChange}
     />{" "}
     Female


     <label>Age*</label>
     <input type="number" name="age" value={formData.age} onChange={handleChange} required />


     <label>Family Medical History</label>
     <select name="familyHistory" value={formData.familyHistory} onChange={handleChange}>
       <option value="">Select...</option>
       <option value="heartDisease">Heart Disease</option>
       <option value="highBloodPressure">High Blood Pressure</option>
       <option value="diabetes">Diabetes</option>
       <option value="none">None</option>
     </select>


     <button type="submit" disabled={mutation.isLoading}>
       {mutation.isLoading ? "Submitting..." : "Submit"}
     </button>
   </form>
 );
}
