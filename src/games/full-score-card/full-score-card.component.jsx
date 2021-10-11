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
  selectIsFirstInnings,
  selectIsFirstInningsFinished,
  selectSecondInnings,
} from '../../reducers/currentScore/currentScore.staticSelectors';
import { ScoreCardContainer } from './full-score-card.styles';

const FullScoreCard = ({
  firstInnings,
  secondInnings,
  isFirstInningsCompleted,
  striker,
  nonStriker,
  bowler,
}) => {
  return (
    <ScoreCardContainer>
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
    </ScoreCardContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  isFirstInningsCompleted: selectIsFirstInningsFinished,
  firstInnings: selectFirstInnings,
  secondInnings: selectSecondInnings,
  striker: selectStriker,
  nonStriker: selectNonStriker,
  bowler: selectBowler,
});

export default connect(mapStateToProps)(FullScoreCard);
