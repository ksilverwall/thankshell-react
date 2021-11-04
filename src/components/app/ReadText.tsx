import { useCallback, useEffect, useState } from 'react';


const ReadText = ({path, render}: {path: string, render: (text: string)=>JSX.Element}) => {
  const [text, setText] = useState<string>('');

  const loadText = useCallback(async() => {
    const response = await fetch(path);
    setText(await response.text());
  }, [path, setText])

  useEffect(()=>{
    loadText();
  }, [loadText]);

  return render(text);
};

export default ReadText;
