export class Browser {
  static get isSafari() {
    return navigator.userAgent.indexOf("Safari") != -1;
  }
}

const mapBrowser: [string, RegExp][] = [
  ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
  ["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
  ["opera", /OPR\/([0-9\.]+)(:?\s|$)$/],
  ["edge", /Edge\/([0-9\._]+)/],
  ["ie", /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/],
  ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ["ie", /MSIE\s(7\.0)/],
  ["safari", /Version\/([0-9\._]+).*Safari/],
  ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
  ["android", /Android\s([0-9\.]+)/],
  ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
  ["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
  ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
];

const mapOs = [
  "Windows Phone",
  "Android",
  "CentOS",
  { name: "Chrome OS", pattern: "CrOS" },
  "Debian",
  "Fedora",
  "FreeBSD",
  "Gentoo",
  "Haiku",
  "Kubuntu",
  "Linux Mint",
  "OpenBSD",
  "Red Hat",
  "SuSE",
  "Ubuntu",
  "Xubuntu",
  "Cygwin",
  "Symbian OS",
  "hpwOS",
  "webOS ",
  "webOS",
  "Tablet OS",
  "Tizen",
  "Linux",
  "Mac OS X",
  "Macintosh",
  "Mac",
  "Windows 98;",
  "Windows ",
];
const mapOperationSystem = {
  "10.0": "10",
  6.4: "10 Technical Preview",
  6.3: "8.1",
  6.2: "8",
  6.1: "Server 2008 R2 / 7",
  "6.0": "Server 2008 / Vista",
  5.2: "Server 2003 / XP 64-bit",
  5.1: "XP",
  5.01: "2000 SP1",
  "5.0": "2000",
  "4.0": "NT",
  "4.90": "ME",
};
const detectMobileRgx = new RegExp(
  [
    "(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|",
    "compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|",
    "midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)",
    "\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|",
    "wap|windows ce|xda|xiino",
  ].join(""),
  "i"
);
const detectMobileRgx2 = new RegExp(
  [
    "1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|",
    "ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|",
    "avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|",
    "cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|",
    "ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|",
    "g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|",
    "hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|",
    "i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|",
    "kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])",
    "|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|",
    "mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|",
    "n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|",
    "op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|",
    "po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|",
    "raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|",
    "se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|k\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|",
    "so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|",
    "tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|",
    "veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|",
    "w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-",
  ].join(""),
  "i"
);
export class OS {
  public navigator: Navigator;
  public process: NodeJS.Process;

  public userAgent: string;

  constructor(n?: Navigator, p?: NodeJS.Process) {
    this.navigator = n as any;
    this.process = p as any;
    this.userAgent = this.navigator ? this.navigator.userAgent || this.navigator.vendor : "";
  }

  detect() {
    if (this.process && !this.userAgent) {
      var t = this.process.version.slice(1).split(".").slice(0, 3),
        e = Array.prototype.slice.call(t, 1).join("") || "0";
      return {
        name: "node",
        version: t.join("."),
        versionNumber: parseFloat(t[0] + "." + e),
        mobile: !1,
        os: this.process.platform,
      };
    }
    return (
      // this.userAgent || this.handleMissingError(),
      Object.assign({}, this.checkBrowser(), this.checkMobile(), this.checkOs())
    );
  }
  checkBrowser() {
    // First check if the provided userAgent string matches any of the regex patterns in the mapBrowser mapping array
    const matchingBrowser = mapBrowser.find((browser) => {
      return browser[1].test(this.userAgent);
    });

    // If a matching browser was not found, return null
    if (!matchingBrowser) {
      return null;
    }

    // Get the version numbers for the found browser and construct a version string
    const versionRegExp = matchingBrowser[1].exec(this.userAgent),
      versionNumbers: any[] = versionRegExp! && versionRegExp[1].split(/[._]/).slice(0, 3);

    // Make sure the version string is at least 2 parts long, with a 0 as the last element if there are only 1 part
    if (versionNumbers.length < 3) {
      versionNumbers.push(versionNumbers.length === 1 ? [0, 0] : [0]);
    }

    // Calculate the versionNumber based on the version numbers
    const versionNumber = Number(
      versionNumbers[0] + "." + Array.prototype.slice.call(versionNumbers, 1).join("")
    );

    // Return an object containing information about the browser
    return {
      name: String(matchingBrowser[0]),
      version: versionNumbers.join("."),
      versionNumber,
    };
  }
  checkMobile() {
    var t = this.userAgent.substr(0, 4);
    return { mobile: detectMobileRgx.test(this.userAgent) || detectMobileRgx2.test(t) };
  }
  checkOs() {
    let _this = this;

    return mapOs
      .map((os) => {
        let name = typeof os === "string" ? os : os.name;
        let pattern = _this.getOsPattern(os);

        return {
          name,
          pattern,
          value: RegExp(
            `\\b${pattern.replace(/([ -])(?!$)/g, "$1?")}(?:x?[\\d._]+|[ \\w.]*)`,
            "i"
          ).exec(_this.userAgent),
        };
      })
      .filter((os) => os.value)
      .map((os) => {
        let name = os.value![0] || "";

        if (os.pattern && os.name && /^Win/i.test(name) && !/^Windows Phone /i.test(name)) {
          let version =
            mapOperationSystem[name.replace(/[^\d.]/g, "") as keyof typeof mapOperationSystem];
          name = `Windows ${version}`;
        }

        // After processing, return the Human Readable version name
        return {
          os: (name = /^(?:webOS|i(?:OS|P))/.test(name)
            ? name
            : name[0].toUpperCase() + name.slice(1))
            .replace(os.pattern, os.name)
            .replace(/ ce$/i, " CE")
            .replace(/\bhpw/i, "web")
            .replace(/\bMacintosh\b/, "Mac OS")
            .replace(/_PowerPC\b/i, " OS")
            .replace(/\b(OS X) [^ \d]+/i, "$1")
            .replace(/\bMac (OS X)\b/, "$1")
            .replace(/\/(\d)/g, " $1")
            .replace(/_/g, ".")
            .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "")
            .replace(/\bx86\.64\b/gi, "x86_64")
            .replace(/\b(Windows Phone) OS\b/, "$1")
            .replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1")
            .split(" on ")[0]
            .trim(),
        };
      })
      .shift();
  }
  getOsPattern(os: string | { name: string; pattern: string }) {
    return "string" == typeof os ? os : os.pattern || os.name;
  }
}

let os = typeof window !== "undefined" ? new OS(window.navigator) : new OS(undefined, process);
const browser = os.detect();
export { os, browser };
