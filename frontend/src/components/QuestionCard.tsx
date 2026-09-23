type QuestionCardProps = {
  number: number;
  category: string;
  question: string;
};

function QuestionCard({
  number,
  category,
  question,
}: QuestionCardProps) {
  return (
    <div className="question-card">
      <div className="question-number">
        {number}
      </div>

      <div className="question-content">
        <h3>{category}</h3>
        <p>{question}</p>
      </div>
    </div>
  );
}

export default QuestionCard;