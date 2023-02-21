import GUI from "lil-gui";

export function addGuiFolderObject(gui: GUI, folderName: string, object: any, listen?: boolean) {
  const folder = gui.addFolder("serviceElipse");
  Object.keys(object).forEach((k) => {
    const controller = folder.add(object, k);
    listen && controller.listen();
  });
}
