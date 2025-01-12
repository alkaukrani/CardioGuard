import React from "react";

function Form() {
  return (
        <div className="container">
            <h1>Form In React</h1>
            <form>
                <label htmlFor="firstname">First Name*</label>
                <input type="text" placeholder="Enter First Name" name="firstname"/>

                <label htmlFor="firstname">Last Name*</label>
                <input type="text" placeholder="Enter Last Name" name="lastname"/>

                <label htmlFor="gender">Gender</label>
                <input type="radio" name="gender"/> Male
                <input type="radio" name="gender"/> Female

                <label htmlFor="age">Age*</label>
                <input type="number" placeholder="Enter Age" name="age" required />

                {/* Family Medical History */}
                <label htmlFor="familyHistory">Family Medical History</label>
                <select name="familyHistory">
                    <option value="">Select...</option>
                    <option value="heartDisease">Heart Disease</option>
                    <option value="highBloodPressure">High Blood Pressure</option>
                    <option value="diabetes">Diabetes</option>
                    <option value="none">None</option>
                </select>


                
            </form>
        </div>
            




    );




}
export default App;
