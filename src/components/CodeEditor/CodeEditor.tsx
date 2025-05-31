import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import modeJava from "ace-builds/src-noconflict/mode-java?url";
import { config } from "ace-builds";
import githubTheme from "ace-builds/src-noconflict/theme-github?url";

config.setModuleUrl("ace/mode/java", modeJava);
config.setModuleUrl("ace/theme/github", githubTheme);

function CodeEditor({
  code,
  readonly,
  onChange,
  height,
  language,
}: {
  code?: string;
  readonly: boolean;
  onChange?: ((value: string, event?: any) => void) | undefined;
  height: string;
  language: "java" | "python" | "c_cpp" | string;
}) {
  console.log(language);
  return (
    <AceEditor
      width={"1000px"}
      readOnly={readonly}
      height={height}
      value={code}
      mode={"java"}
      theme="monokai"
      fontSize="16px"
      highlightActiveLine={true}
      onChange={onChange}
      enableLiveAutocompletion={true}
      setOptions={{
        enableLiveAutocompletion: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
}

export default CodeEditor;
