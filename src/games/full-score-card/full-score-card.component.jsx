import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Accordion from '../../components/accordion/accordion.component';
import {
  selectBowler,
  selectBattingTeam,
  selectNonStriker,
  selectStriker,
} from '../../reducers/currentScore/currentScore.selectors';

const FullScoreCard = ({ firstInnings, striker, nonStriker, bowler }) => {
  return (
    <Accordion
      innings={firstInnings}
      striker={striker}
      nonStriker={nonStriker}
      bowler={bowler}
    />
  );
};

const mapStateToProps = createStructuredSelector({
  firstInnings: selectBattingTeam,
  striker: selectStriker,
  nonStriker: selectNonStriker,
  bowler: selectBowler,
});

export default connect(mapStateToProps)(FullScoreCard);
