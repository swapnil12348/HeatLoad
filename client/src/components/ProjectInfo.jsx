import { useHeatLoad } from "../context/HeatLoadContext";
import { fieldLabel, fieldInput, COLOR } from "../constants/styles";

const FIELDS = [
  ["hvacContractor", "HVAC Contractor", "text",  "Contractor name"],
  ["consultant",     "Consultant",      "text",  "Consultant name"],
  ["client",         "Client",          "text",  "Client name"],
  ["jobRefNo",       "Job Ref. No.",    "text",  "e.g. 2024.001"],
  ["date",           "Date",            "date",  ""],
];

/**
 * ProjectInfo
 * Collects project metadata (contractor, client, job number, date).
 */
export default function ProjectInfo() {
  const { state, dispatch } = useHeatLoad();
  const { project } = state;

  const handleChange = (field, value) =>
    dispatch({ type: "UPDATE_PROJECT", payload: { [field]: value } });

  return (
    <div style={{
      background: COLOR.white,
      borderRadius: 10,
      padding: "16px 20px",
      marginBottom: 20,
      border: `1px solid ${COLOR.gray200}`,
      borderLeft: `4px solid ${COLOR.brandMid}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <h2 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: COLOR.brand }}>
        Project Information
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {FIELDS.map(([key, label, type, placeholder]) => (
          <div key={key}>
            <label style={fieldLabel}>{label}</label>
            <input
              type={type}
              value={project[key] || ""}
              placeholder={placeholder}
              onChange={(e) => handleChange(key, e.target.value)}
              style={fieldInput}
              onFocus={(e) => (e.target.style.borderColor = COLOR.brandMid)}
              onBlur={(e)  => (e.target.style.borderColor = COLOR.gray300)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}