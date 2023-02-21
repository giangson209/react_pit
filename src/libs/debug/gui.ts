import GUI, { Controller } from "lil-gui";

let gui: GUI;
export class DebugGUI<T extends Record<string | number, any>> {
  public gui!: GUI;
  public object: T = {} as T;

  public folders: Record<string, { folder: GUI; object: Record<string, any> }> = {};
  private _controllers: Record<keyof T, Controller> = {} as any;
  constructor(defaultObject?: T, options: any = {}) {
    if (typeof window == "undefined") return;
    if (!gui) gui = this.gui = new GUI();
    else this.gui = gui;
    this.object = defaultObject as any;
    if (options.position === "left") this.gui.domElement.style.left = "0px";
  }
  addItem<K extends keyof T>(name: K) {
    if (!this.object[name]) this.object[name] = "" as T[K];
    this._controllers[name] = this.gui.add(this.object, name as any).listen();
  }
  updateValue<K extends keyof T>(name: K, value: T[K]) {
    this.object[name] = value;
  }
  destroy<K extends keyof T>(name: K) {
    this._controllers[name].destroy();
    delete this._controllers[name];
    delete this.object[name];
  }

  addFolder(name: string) {
    const object = {};
    this.folders[name] = { folder: this.gui.addFolder(name), object };
    return object;
  }
  addFolderItem(folderName: string, name: string, defaultValue?: any) {
    const { folder, object } = this.folders[folderName];
    object[name] = defaultValue;
    folder.add(object, name).listen();
  }

  destroyFolder(name: string) {
    this.folders[name].folder.destroy();
    delete this.folders[name];
  }
}

export class InnerChildGUI<T extends Record<string, any>> {
  folder: GUI;
  object: T;
  private _bindProperty: Map<string, Controller> = new Map();
  constructor(gui: GUI, object: T) {
    this.folder = gui;
    this.object = object;
  }

  addDefaultObject<T extends Record<string, any>>(object: T) {
    Object.assign(this.object, object);
    Object.keys(object).forEach((k) => this.folder.add(this.object, k).listen());
    return this.object as unknown as T;
  }

  destroy() {
    this.folder.destroy();
  }

  add(property: string) {
    if (this._bindProperty.has(property)) return this._bindProperty.get(property)!;
    this._bindProperty.set(property, this.folder.add(this.object, property));
    return this._bindProperty.get(property)!;
  }

  delete(property: string) {
    this._bindProperty.get(property)?.destroy();
    this._bindProperty.delete(property);
  }
}

export class InnerGUI {
  protected isEnabled: boolean = true;

  public gui!: GUI;
  private _bindFolder: Map<string, InnerChildGUI<any>> = new Map();
  private _objects: Map<string, any> = new Map();

  constructor() {
    if (typeof window === "undefined") return;
    this.gui = new GUI();
  }

  addObject<T extends Record<string, any>>(name: string): InnerChildGUI<T> {
    if (!this.gui) return null as any;
    if (this._bindFolder.has(name)) return this._bindFolder.get(name)!;
    const object: T = {} as unknown as any;
    this._objects.set(name, object);

    const innerChildGui = new InnerChildGUI(this.gui.addFolder(name), object);
    this._bindFolder.set(name, innerChildGui);
    return innerChildGui;
  }

  getObject(name: string) {
    return this._objects.get(name)!;
  }

  deleteObject(name: string) {
    this._bindFolder.get(name)?.destroy();
    this._bindFolder.delete(name);
  }
}
export const innerGUI = new InnerGUI();
export default DebugGUI;
