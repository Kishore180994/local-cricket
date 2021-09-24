import { connect } from "react-redux";
import { selectExtras, selectWides } from "../actions";

const MatchSettings = ({
  Field,
  renderCheck,
  renderInput,
  selectExtras,
  selectWides,
  isWidesSelected,
  isExtrasSelected,
}) => {
  const showOptions = (val, option) => {
    return option === "extras"
      ? selectExtras(val.target.checked)
      : selectWides(val.target.checked);
  };

  const renderWides = () => {
    if (isWidesSelected)
      return (
        <Field
          className="item"
          name="wpr"
          type="number"
          label="Number of wides for 1 run"
          component={renderInput}
        />
      );
  };

  const renderFields = () => {
    if (isExtrasSelected)
      return (
        <div>
          <Field
            className="item"
            name="noball"
            type="checkbox"
            label="No Ball "
            component={renderCheck}
          />
          <Field
            className="item"
            name="wides"
            type="checkbox"
            label="Wides"
            val={isWidesSelected}
            change
            showOptions={showOptions}
            component={renderCheck}
          />
          {renderWides()}
          <Field
            className="item"
            name="byes"
            type="checkbox"
            label="Byes"
            component={renderCheck}
          />
          <Field
            className="item"
            name="legbyes"
            type="checkbox"
            label="Leg Byes"
            component={renderCheck}
          />
        </div>
      );
  };
  return (
    <div className="ui card center aligned container">
      <div className="content">
        <Field
          className="field"
          name="overs"
          type="number"
          label="Overs "
          component={renderInput}
        />
        <Field
          className="item"
          name="extras"
          type="checkbox"
          label="Extras "
          component={renderCheck}
          val={isExtrasSelected}
          change
          showOptions={(value) => showOptions(value, "extras")}
        />
        {renderFields()}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isExtrasSelected: state.events.isSelectedExtra,
    isWidesSelected: state.events.isSelectedWides,
  };
};

export default connect(mapStateToProps, { selectExtras, selectWides })(
  MatchSettings
);
