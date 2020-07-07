import React, { useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';

const getServerVersionAsync = async() => {
  const timestamp = new Date().getTime();
  try {
    const response = await fetch(`/revision.json?${timestamp}`);
    const data = await response.json();

    return data.version;
  } catch(err) {
    return null
  }
};

const RevisionUpdateMessage = ({localVersion, remoteVersion, setRemoteVersion}) => {
  useEffect(async()=>{
    setRemoteVersion(await getServerVersionAsync())
    const interval = setInterval(async()=>{
      setRemoteVersion(await getServerVersionAsync())
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [])

  if (!localVersion || !remoteVersion) {
      return null;
  }

  if (localVersion === remoteVersion) {
      return null;
  }

  return (
    <Alert variant='warning'>
      新規バージョン {remoteVersion} が利用できます
      <Button onClick={()=>window.location.reload(true)}>更新</Button>
    </Alert>
  )
};

export default RevisionUpdateMessage;
