export const ToggleVideo = ({checked, onChange}) => (
    <div className="toggle">
    <input className="toggle_input" type="checkbox" id="toggleBtn" checked={checked} onChange={onChange} />
    <label className="toggle_label" for="toggleBtn">
      <div className="toggle-btn"></div>
    </label>
  </div>
)
export const ToggleAudio = ({checkedAud, onChangeAud}) => (
    <div className="toggle">
    <input className="toggle_input" type="checkbox" id="toggleBtn2" checked={checkedAud} onChange={onChangeAud} />
    <label className="toggle_label" for="toggleBtn2">
      <div className="toggle-btn"></div>
    </label>
  </div>
)