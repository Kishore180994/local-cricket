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
import {
  selectFirstInnings,
  selectSecondInnings,
} from '../../reducers/currentScore/currentScore.staticSelectors';

const FullScoreCard = ({
  firstInnings,
  secondInnings,
  striker,
  nonStriker,
  bowler,
}) => {
  return (
    <div>
      <Accordion
        innings={firstInnings}
        striker={striker}
        nonStriker={nonStriker}
        bowler={bowler}
      />
      {/* <Accordion
        innings={secondInnings}
        striker={striker}
        nonStriker={nonStriker}
        bowler={bowler}
      /> */}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  firstInnings: selectFirstInnings,
  secondInnings: selectSecondInnings,
  striker: selectStriker,
  nonStriker: selectNonStriker,
  bowler: selectBowler,
});

export default connect(mapStateToProps)(FullScoreCard);
