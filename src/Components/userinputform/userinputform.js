import React, { useState } from "react";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();

function UserInputForm() {
  const [formData, setFormData] = useState({
    firstName: "",  // Changed from firstname to match backend
    lastName: "",   // Changed from lastname to match backend
    gender: "",
    age: "",
    familyHistory: "",
    healthMetrics: [{
      cholesterolLDL: "",
      cholesterolHDL: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      bloodSugar: "",
      restingHeartRate: "",
      smoking: false,
      alcoholConsumption: ""
    }],
    whoopId: localStorage.getItem('whoop_access_token') // Add WHOOP token
  });

  const mutation = useMutation((newUser) => 
    axios.post("http://localhost:5001/api/users", newUser, {  // Changed port to 5001
      headers: {
        'Content-Type': 'application/json'
      }
    })
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested healthMetrics fields
    if (['cholesterolLDL', 'cholesterolHDL', 'bloodPressureSystolic', 
         'bloodPressureDiastolic', 'bloodSugar', 'restingHeartRate'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        healthMetrics: [{
          ...prev.healthMetrics[0],
          [name]: value
        }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      mutation.mutate(formData, {
        onSuccess: (response) => {
          console.log('Success:', response.data);
          alert("User submitted successfully!");
        },
        onError: (error) => {
          console.error('Error:', error);
          alert("Error submitting the form: " + error.message);
        }
      });
    } catch (error) {
      console.error('Error:', error);
      alert("Error submitting the form");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label>First Name*</label>
        <input 
          type="text" 
          name="firstName"  // Changed from firstname
          value={formData.firstName} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div>
        <label>Last Name*</label>
        <input 
          type="text" 
          name="lastName"  // Changed from lastname
          value={formData.lastName} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div>
        <label>Gender</label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={formData.gender === "male"}
          onChange={handleChange}
        /> Male
        <input
          type="radio"
          name="gender"
          value="female"
          checked={formData.gender === "female"}
          onChange={handleChange}
        /> Female
      </div>

      <div>
        <label>Age*</label>
        <input 
          type="number" 
          name="age" 
          value={formData.age} 
          onChange={handleChange} 
          required 
        />
      </div>

      {/* Health Metrics Fields */}
      <div>
        <label>Cholesterol LDL (mg/dL)</label>
        <input
          type="number"
          name="cholesterolLDL"
          value={formData.healthMetrics[0].cholesterolLDL}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Blood Pressure Systolic (mm Hg)</label>
        <input
          type="number"
          name="bloodPressureSystolic"
          value={formData.healthMetrics[0].bloodPressureSystolic}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Blood Pressure Diastolic (mm Hg)</label>
        <input
          type="number"
          name="bloodPressureDiastolic"
          value={formData.healthMetrics[0].bloodPressureDiastolic}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Family Medical History</label>
        <select 
          name="familyHistory" 
          value={formData.familyHistory} 
          onChange={handleChange}
        >
          <option value="">Select...</option>
          <option value="heartDisease">Heart Disease</option>
          <option value="highBloodPressure">High Blood Pressure</option>
          <option value="diabetes">Diabetes</option>
          <option value="none">None</option>
        </select>
      </div>

      <button 
        type="submit" 
        disabled={mutation.isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {mutation.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default UserInputForm;