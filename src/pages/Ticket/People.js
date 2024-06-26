import React from 'react'; // React를 가져옴

const People = ({ selectedPeople, setSelectedPeople }) => { // People 컴포넌트를 만듭니다. 선택된 사람 수와 설정하는 함수를 props로 받음
  const handleSelect = (people) => { // 사람 수를 선택했을 때 실행되는 함수
    setSelectedPeople(people); // 선택한 사람 수를 설정
  };

  return (
    <div className="people"> {/* 전체 내용을 감싸는 큰 상자*/}
      <h2>인원선택</h2> {/* 인원 선택 제목*/}
      <p>최대 2매까지 예약 가능</p> {/* 최대 예약 가능 인원을 설명하는 문구*/}
      <div className="people-choose"> {/* 사람 수를 선택하는 버튼들을 감싸는 상자*/}
        <button
          className={`choice ${selectedPeople === 1 ? 'selected' : ''}`} // 1명을 선택하는 버튼, 선택된 경우 'selected' 클래스를 추가
          onClick={() => handleSelect(1)} // 버튼을 클릭하면 1명을 선택
        >
          1
        </button>
        <button
          className={`choice ${selectedPeople === 2 ? 'selected' : ''}`} // 2명을 선택하는 버튼, 선택된 경우 'selected' 클래스를 추가
          onClick={() => handleSelect(2)} // 버튼을 클릭하면 2명을 선택
        >
          2
        </button>
      </div>
    </div>
  );
};

export default People; // People 컴포넌트를 내보내서 다른 파일에서 사용할 수 있게 함
