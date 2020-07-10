import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { ReactSVG } from 'react-svg'
import LogoutButton from './LogoutButton'
import { css } from 'glamor'

const ClearLocalStorageButton = () => {
  return (
    <Button variant="outline-success" onClick={()=>localStorage.clear()}>
      ClearCache
    </Button>
  )
};

const EditButton = ({onClick}) => {
  const styles = css({
    ' svg': {
      height: "30px",
      width: "30px",
      padding: "5px",
    },
  })

  return (
    <ReactSVG src='/images/pen.svg' {...styles} onClick={onClick}/>
  )
}

const SubmitButton = ({onClick}) => {
  const styles = css({
    ' svg': {
      height: "30px",
      width: "30px",
      padding: "5px",
    },
  })

  return (
    <ReactSVG src='/images/check.svg' {...styles} onClick={onClick}/>
  )
}

const ErrorMessage = ({message}) => message && message.length ? (
  <Alert variant="danger">{message}</Alert>
) : null

// FIXME: LogoutButton must not be in this component
const UserConfig = ({ memberId, memberDetail, auth, api, reloadMembers }) => {
  const flex = css({
    display: '-webkit-flex',
    display: 'flex',
  })

  const [editMode, setEditMode] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [editBuffer, setEditBuffer] = useState(memberDetail ? memberDetail.displayName : '-----')

  return (
    <section>
      <ErrorMessage variant="danger">{errorMessage}</ErrorMessage>
      <div className='flex-area' {...flex}>
        {
          editMode ? (
            <React.Fragment>
              <input type="text" value={editBuffer} onChange={(event) => setEditBuffer(event.target.value)}/>
              <SubmitButton onClick={async() => {
                setEditMode(false)
                if (editBuffer !== memberDetail.displayName) {
                  try {
                    await api.updateUser(memberId, {displayName: editBuffer})
                    reloadMembers()
                  } catch(err) {
                    console.log(err);
                    setErrorMessage(err.message)
                  }
                }
              }}/>
            </React.Fragment>
          )
          : (
            <React.Fragment>
              <h2>{editBuffer}</h2>
              <EditButton onClick={() => setEditMode(true)}/>
            </React.Fragment>
          )
        }
      </div>
      <p>ID: {memberId ? memberId : '-----'}</p>
      <ClearLocalStorageButton/>
      <LogoutButton auth={auth} />
    </section>
  )
}

export default UserConfig
