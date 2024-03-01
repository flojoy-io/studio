import { memo } from "react";
import { resolveBlockSVG } from "../svg-helper";

const DefaultInstrumentSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100pt"
    height="100pt"
    viewBox="0 0 100 100"
  >
    <path
      className="fill-accent4"
      d="M67.617 54.402l3.473-.383a3.234 3.234 0 00-3.531-2.625 3.234 3.234 0 00-2.86 3.567 3.237 3.237 0 003.57 2.859 3.233 3.233 0 002.872-3.363l-3.477.383zm-7.766 0l3.473-.383a3.234 3.234 0 00-3.531-2.625 3.234 3.234 0 10.71 6.426 3.233 3.233 0 002.872-3.363l-3.477.383zm23.301 0l3.473-.383a3.237 3.237 0 00-3.531-2.629 3.234 3.234 0 00-2.86 3.567 3.237 3.237 0 003.57 2.86 3.236 3.236 0 002.872-3.364l-3.477.383zm-7.765 0l3.472-.383a3.23 3.23 0 00-6.39.941 3.237 3.237 0 003.57 2.86 3.233 3.233 0 002.871-3.363l-3.472.383zm-29.746-.918v2.254h1.746l.004-2.262-1.746.008zm-6.29 2.254h1.747l.004-2.262-1.746.008zm12.579 0h1.746l.004-2.262-1.75.008zm-9.434 0h1.746l.004-2.262-1.746.008zm6.285 0h1.746l.004-2.262-1.75.008zM6.148 32.035v33.984h3.567v1.937h3.101V66.02h74.367v1.937h3.102V66.02h3.566V32.035zm85.105 30.762H8.788v-1.313h.043l82.422-.003zm2.09-2.617H6.61V34.27h86.73zM16.804 46.05c.64 1.231 1.93 2.938 2.676 2.938h.035l.063-.004.058.004a.12.12 0 00.035.004c.75 0 2.04-1.707 2.68-2.937.328-.618 2.043-3.684 3.977-3.684h.015c1.95-.133 3.711 3.055 4.035 3.684.645 1.23 1.93 2.937 2.676 2.937h.035l.063-.004.062.004c.012.004.024.004.036.004.343 0 1.023-.441 1.902-1.68l.254-.359c-.004-.781-.024-1.512-.059-1.707-.183-4.574-.644-8.984-4.746-8.7l-14.797-.011c-3.414-.238-4.305 2.77-4.613 6.418.55-.418 1.09-.617 1.601-.594 1.934-.101 3.688 3.059 4.012 3.688zm59.492 1.032a.235.235 0 00.234-.234v-.473h.715l.004-2.414h-1.902v2.414h.719v.473a.225.225 0 00.23.234zm-.8-.863v-2.106h1.597l-.004 2.106h-.562v-1.145a.235.235 0 00-.235-.234.233.233 0 00-.234.234v1.145zm11.183 2.527l-47.336.004v1.308h47.312zm-12.098-7.492a2 2 0 001.782-2.09l-2.157.238-.03-.273 2.155-.238a2.008 2.008 0 00-3.969.586 2.015 2.015 0 002.22 1.777zM69.84 37.1H39.343v9.477H69.84zm-28.828 8.86h-.941v-6.598h.941zm1.098 0h-.938v-6.027h.942zm1.105 0h-.945v-5.524h.941zm1.098 0h-.941v-5.152h.941zm1.102 0h-.942v-4.844h.942zm1.097 0h-.941v-4.563h.941zm1.102 0h-.941v-4.977h.94zm1.102 0h-.942V40.59h.942zm1.097 0h-.941v-5.895h.941zm1.102 0h-.942v-6.203h.942zm1.101 0h-.941v-5.895h.941zm1.098 0h-.941v-5.547h.941zm1.106 0h-.942v-5.238h.942zm1.097 0h-.941v-4.977h.941zm1.102 0h-.941v-4.672h.94zm1.102 0h-.942v-4.406h.942zm1.097 0h-.941v-4.672h.941zm1.102 0h-.942v-5.133h.942zm1.098 0h-.942v-5.438h.942zm1.105 0h-.941v-5.766h.941zm1.098 0h-.942v-5.567h.942zm1.097 0h-.941v-5.324h.941zm2.942 0h-1.387v-.156h1.387zm0-.39h-1.387v-.157h1.387zm0-.391h-1.387v-.157h1.387zm0-.391h-1.387v-.156h1.387zm0-.39h-1.387v-.157h1.387zm0-.391h-1.387v-.157h1.387zm0-.39h-1.387v-.157h1.387zm0-.388h-1.387v-.156h1.387zm0-.39h-1.387v-.156h1.387zm0-.39h-1.387v-.157h1.387zm0-.391h-1.387v-.157h1.387zm0-.391h-1.387v-.156h1.387zm0-.39h-1.387v-.157h1.387zm0-.391h-1.387v-.157h1.387zm1.687 5.074h-1.382v-.156h1.382zm0-.39h-1.382v-.157h1.382zm0-.391h-1.382v-.157h1.382zm0-.391h-1.382v-.156h1.382zm0-.39h-1.382v-.157h1.382zm0-.391h-1.382v-.157h1.382zm0-.39h-1.382v-.157h1.382zm0-.388h-1.382v-.156h1.382zm0-.39h-1.382v-.156h1.382zm0-.39h-1.382v-.157h1.382zm0-.391h-1.382v-.157h1.382zm0-.391h-1.382v-.156h1.382zm0-.39h-1.382v-.157h1.382zm0-.391h-1.382v-.157h1.382zm5.356 3.074h-.719v-.555a.235.235 0 00-.234-.234.233.233 0 00-.235.234v.555h-.718v2.414h1.902zm-.156 2.258h-1.598v-2.106h.562v1.067a.235.235 0 00.469 0v-1.067h.567zm9.59-2.262h-.65v-.367h-.003a.235.235 0 00-.234-.235.235.235 0 00-.235.235v.367h-.785v2.414h1.902zm-.157 2.262h-1.594v-2.106h.633v1.254c0 .129.106.234.235.234a.233.233 0 00.234-.234v-1.254h.496zm-3.941.863a.233.233 0 00.234-.234v-.473h.715l.004-2.414h-1.902v2.414h.718v.473a.23.23 0 00.23.234zm-.797-.863v-2.106h1.598l-.004 2.106h-.563v-1.145c0-.129-.105-.234-.234-.234s-.235.105-.235.234v1.145zm5.187-5.09a2.007 2.007 0 001.79-3.59l-.907 1.973-.246-.114.906-1.972a2.004 2.004 0 00-2.527 1.039c-.46 1.004-.02 2.199.984 2.664zM15.805 57.906H30.61c4.094.285 4.563-4.098 4.746-8.656-.726.742-1.43 1.132-2.097 1.132-.032 0-.067 0-.098-.003-.031 0-.062.003-.094.003-1.898 0-3.597-3.07-3.922-3.687-.64-1.23-1.93-2.938-2.675-2.938-.012 0-.024 0-.036.004l-.07.004h-.027c-.774 0-2.09 1.707-2.738 2.938-.325.62-2.07 3.781-4.012 3.683-.031 0-.063.004-.094.004-1.906 0-3.598-3.074-3.922-3.687-.64-1.23-1.93-2.938-2.676-2.938-.011 0-.023 0-.035.004l-.066.008-.063-.008h-.03c-.161 0-.618.102-1.411 1.043l-.223.266c-.004.058-.004.113-.008.172-.078.437-.078 3.53 0 3.968.18 4.563.637 8.973 4.746 8.688zm70.09-14.312c0-.129-.105-.235-.234-.235s-.234.106-.234.235v.367h-.649v2.414h1.902v-2.414h-.785zm.63.52l-.005 2.105h-1.59v-2.106h.493v1.254c0 .13.105.235.234.235a.233.233 0 00.234-.235v-1.254zm-6.762-2.805a2.012 2.012 0 001.796-2.203 2.006 2.006 0 00-2.078-1.801l.223 2.16-.27.027-.222-2.156a2.004 2.004 0 00-1.649 2.18 2.003 2.003 0 002.2 1.793z"
    ></path>
  </svg>
);

const blockNameToSVGMap = {
  default: DefaultInstrumentSVG,
};

export default memo(resolveBlockSVG(blockNameToSVGMap));
