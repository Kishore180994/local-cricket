import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Accordion from '../../components/accordion/accordion.component';
import {
  selectBowler,
  selectNonStriker,
  selectStriker,
} from '../../reducers/currentScore/currentScore.selectors';
import {
  selectFirstInnings,
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
      <Accordion innings={firstInnings} />
      <Accordion innings={secondInnings} />
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
