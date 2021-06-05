type EnvironmentVariables = {
  apiUrl: string,
}

const LoadEnv = ({render}: {render: (env: EnvironmentVariables)=>JSX.Element}) => {
  if (!process.env.REACT_APP_THANKSHELL_API_URL) {
    throw new Error("Application Error: process.env.REACT_APP_THANKSHELL_API_URL is not set");
  }

  return render({
    apiUrl: process.env.REACT_APP_THANKSHELL_API_URL,
  });
};

export default LoadEnv;

