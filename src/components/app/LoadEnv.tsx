export type EnvironmentVariables = {
  apiUrl: string,
  version?: string,
}

const LoadEnv = ({render}: {render: (env: EnvironmentVariables)=>JSX.Element}) => {
  if (!process.env.REACT_APP_THANKSHELL_API_URL) {
    throw new Error("Application Error: process.env.REACT_APP_THANKSHELL_API_URL is not set");
  }

  return render({
    apiUrl: process.env.REACT_APP_THANKSHELL_API_URL,
    version: process.env.REACT_APP_VERSION,
  });
};

export default LoadEnv;

