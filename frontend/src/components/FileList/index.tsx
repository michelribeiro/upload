import { CircularProgressbar } from "react-circular-progressbar";
import { FileInfo, Preview } from "./styles";
import { MdCheckCircle, MdError, MdLink } from "react-icons/md";

interface AttrFiles {
  file: File;
  id: number;
  name: string;
  readableSize: string;
  preview: string;
  progress: number;
  uploaded: boolean;
  error: boolean;
  url: string;
}

const FileListItem = ({
  file,
  id,
  name,
  readableSize,
  preview,
  progress,
  uploaded,
  error,
  url,
}: AttrFiles) => {

  return (
    <li>
      <FileInfo>
        <Preview src={preview}></Preview>
        <div>
          <strong>{name}</strong>
          <span>
            {readableSize}{" "}
            {!!url && (
                <button onClick={() => {}}>Excluir</button>
            )}
          </span>
        </div>
      </FileInfo>
      <div>
        {!uploaded && !error && (
          <CircularProgressbar
            styles={{
              root: { width: 24 },
              path: { stroke: "#7159c1" },
            }}
            strokeWidth={10}
            value={progress}
          />
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MdLink style={{ marginRight: 8 }} size={24} color="#222" />
          </a>
        )}
        {uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
        {error && <MdError size={24} color="#e57878" />}<small>{progress}{"%"}</small>
      </div>
    </li>
  );
};

export default FileListItem;
