export type Time = {
    label: string;
    value: string;
    selectable: boolean;
  };
  
  export type TDropDownProps = {
    list: Time[];
    handleTimePicker: (value: string) => void;
    currentValue: string | number;
    placeHolder?: string;
    selectable?: boolean;
    filterTime?: (time: Time) => boolean;
  };
  
  const DropDown = ({
    list,
    handleTimePicker,
    currentValue,
    placeHolder,
    selectable = false,
    filterTime,
  }: TDropDownProps) => {
  
    const [isFolded, setIsFolded] = useState(true);
  
      
      const handleClick = (e: React.MouseEvent) => {
        setIsFolded((prev) => !prev);
      };
      
       const renderLisItem = (time: Time) => {
      const result = filterTime ? filterTime(time) : true;
  
      return (
        <li
          key={time.value}
          onClick={() => handleClickTime(time.value)}
          disabled={!time.selectable || !result}
        >
          {time.label}
        </li>
      );
    };
      
       return (
        <div>
          <ul $isFolded={isFolded} onClick={handleClick}>
            {currentValue ? currentValue : placeHolder}
          </ul>
  
          {!isFolded && (
            <ul>
              <RenderList data={list} renderItem={renderLisItem} />
            </ul>
          )}
        </div>
      );
  );