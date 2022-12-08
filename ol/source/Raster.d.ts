/**
 * @param {Uint8ClampedArray} data Image data.
 * @param {number} width Number of columns.
 * @param {number} height Number of rows.
 * @return {ImageData} Image data.
 */
export function newImageData(data: Uint8ClampedArray, width: number, height: number): ImageData;
/**
 * @typedef {function(Error, ImageData, (Object|Array<Object>)): void} JobCallback
 */
/**
 * @typedef {Object} Job
 * @property {Object} meta Job metadata.
 * @property {Array<ImageData>} inputs Array of input data.
 * @property {JobCallback} callback Called when the job is complete.
 */
/**
 * @typedef {Object} ProcessorOptions
 * @property {number} threads Number of workers to spawn.
 * @property {Operation} operation The operation.
 * @property {Object<string, Function>} [lib] Functions that will be made available to operations run in a worker.
 * @property {number} queue The number of queued jobs to allow.
 * @property {boolean} [imageOps=false] Pass all the image data to the operation instead of a single pixel.
 */
/**
 * @classdesc
 * A processor runs pixel or image operations in workers.
 */
export class Processor extends Disposable {
    /**
     * @param {ProcessorOptions} config Configuration.
     */
    constructor(config: ProcessorOptions);
    _imageOps: boolean;
    _workers: Worker[];
    /**
     * @type {Array<Job>}
     * @private
     */
    private _queue;
    _maxQueueLength: number;
    _running: number;
    /**
     * @type {Object<number, any>}
     * @private
     */
    private _dataLookup;
    /**
     * @type {Job}
     * @private
     */
    private _job;
    /**
     * Run operation on input data.
     * @param {Array<ImageData>} inputs Array of image data.
     * @param {Object} meta A user data object.  This is passed to all operations
     *     and must be serializable.
     * @param {function(Error, ImageData, Object): void} callback Called when work
     *     completes.  The first argument is any error.  The second is the ImageData
     *     generated by operations.  The third is the user data object.
     */
    process(inputs: Array<ImageData>, meta: any, callback: (arg0: Error, arg1: ImageData, arg2: any) => void): void;
    /**
     * Add a job to the queue.
     * @param {Job} job The job.
     */
    _enqueue(job: Job): void;
    /**
     * Dispatch a job.
     */
    _dispatch(): void;
    /**
     * Handle messages from the worker.
     * @param {number} index The worker index.
     * @param {MessageEvent} event The message event.
     */
    _onWorkerMessage(index: number, event: MessageEvent): void;
    /**
     * Resolve a job.  If there are no more worker threads, the processor callback
     * will be called.
     */
    _resolveJob(): void;
}
/**
 * @typedef {'pixel' | 'image'} RasterOperationType
 * Raster operation type. Supported values are `'pixel'` and `'image'`.
 */
/**
 * @typedef {import("./Image.js").ImageSourceEventTypes|'beforeoperations'|'afteroperations'} RasterSourceEventTypes
 */
/**
 * @classdesc
 * Events emitted by {@link module:ol/source/Raster~RasterSource} instances are instances of this
 * type.
 */
export class RasterSourceEvent extends Event {
    /**
     * @param {string} type Type.
     * @param {import("../Map.js").FrameState} frameState The frame state.
     * @param {Object|Array<Object>} data An object made available to operations.  For "afteroperations" evenets
     * this will be an array of objects if more than one thread is used.
     */
    constructor(type: string, frameState: import("../Map.js").FrameState, data: any | Array<any>);
    /**
     * The raster extent.
     * @type {import("../extent.js").Extent}
     * @api
     */
    extent: import("../extent.js").Extent;
    /**
     * The pixel resolution (map units per pixel).
     * @type {number}
     * @api
     */
    resolution: number;
    /**
     * An object made available to all operations.  This can be used by operations
     * as a storage object (e.g. for calculating statistics).
     * @type {Object}
     * @api
     */
    data: any;
}
export default RasterSource;
export type MinionData = {
    /**
     * Array of buffers.
     */
    buffers: Array<ArrayBuffer>;
    /**
     * Operation metadata.
     */
    meta: any;
    /**
     * The operation is an image operation.
     */
    imageOps: boolean;
    /**
     * The width of the image.
     */
    width: number;
    /**
     * The height of the image.
     */
    height: number;
};
export type FauxMessageEvent = {
    /**
     * Message data.
     */
    data: any;
};
export type JobCallback = (arg0: Error, arg1: ImageData, arg2: (any | Array<any>)) => void;
export type Job = {
    /**
     * Job metadata.
     */
    meta: any;
    /**
     * Array of input data.
     */
    inputs: Array<ImageData>;
    /**
     * Called when the job is complete.
     */
    callback: JobCallback;
};
export type ProcessorOptions = {
    /**
     * Number of workers to spawn.
     */
    threads: number;
    /**
     * The operation.
     */
    operation: Operation;
    /**
     * Functions that will be made available to operations run in a worker.
     */
    lib?: {
        [x: string]: Function;
    } | undefined;
    /**
     * The number of queued jobs to allow.
     */
    queue: number;
    /**
     * Pass all the image data to the operation instead of a single pixel.
     */
    imageOps?: boolean | undefined;
};
/**
 * A function that takes an array of input data, performs some operation, and
 * returns an array of output data.
 * For `pixel` type operations, the function will be called with an array of
 * pixels, where each pixel is an array of four numbers (`[r, g, b, a]`) in the
 * range of 0 - 255. It should return a single pixel array.
 * For `'image'` type operations, functions will be called with an array of
 * [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
 * and should return a single
 * [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData).
 * The operations
 * are called with a second "data" argument, which can be used for storage.  The
 * data object is accessible from raster events, where it can be initialized in
 * "beforeoperations" and accessed again in "afteroperations".
 */
export type Operation = (arg0: (Array<Array<number>> | Array<ImageData>), arg1: any) => (Array<number> | ImageData);
/**
 * Raster operation type. Supported values are `'pixel'` and `'image'`.
 */
export type RasterOperationType = 'pixel' | 'image';
export type RasterSourceEventTypes = import("./Image.js").ImageSourceEventTypes | 'beforeoperations' | 'afteroperations';
export type Options = {
    /**
     * Input
     * sources or layers.  For vector data, use an VectorImage layer.
     */
    sources: Array<import("./Source.js").default | import("../layer/Layer.js").default>;
    /**
     * Raster operation.
     * The operation will be called with data from input sources
     * and the output will be assigned to the raster source.
     */
    operation?: Operation | undefined;
    /**
     * Functions that will be made available to operations run in a worker.
     */
    lib?: any;
    /**
     * By default, operations will be run in a single worker thread.
     * To avoid using workers altogether, set `threads: 0`.  For pixel operations, operations can
     * be run in multiple worker threads.  Note that there is additional overhead in
     * transferring data to multiple workers, and that depending on the user's
     * system, it may not be possible to parallelize the work.
     */
    threads?: number | undefined;
    /**
     * Operation type.
     * Supported values are `'pixel'` and `'image'`.  By default,
     * `'pixel'` operations are assumed, and operations will be called with an
     * array of pixels from input sources.  If set to `'image'`, operations will
     * be called with an array of ImageData objects from input sources.
     */
    operationType?: RasterOperationType | undefined;
    /**
     * Resolutions. If specified, raster operations will only
     * be run at the given resolutions.  By default, the resolutions of the first source with resolutions
     * specified will be used, if any. Set to `null` to use any view resolution instead.
     */
    resolutions?: number[] | null | undefined;
};
/**
 * *
 */
export type RasterSourceOnSignature<Return> = import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> & import("../Observable").OnSignature<import("../ObjectEventType").Types, import("../Object").ObjectEvent, Return> & import("../Observable").OnSignature<import("./Image.js").ImageSourceEventTypes, import("./Image.js").ImageSourceEvent, Return> & import("../Observable").OnSignature<RasterSourceEventTypes, RasterSourceEvent, Return> & import("../Observable").CombinedOnSignature<import("../Observable").EventTypes | import("../ObjectEventType").Types | RasterSourceEventTypes, Return>;
import Disposable from "../Disposable.js";
import Event from "../events/Event.js";
/**
 * @typedef {Object} Options
 * @property {Array<import("./Source.js").default|import("../layer/Layer.js").default>} sources Input
 * sources or layers.  For vector data, use an VectorImage layer.
 * @property {Operation} [operation] Raster operation.
 * The operation will be called with data from input sources
 * and the output will be assigned to the raster source.
 * @property {Object} [lib] Functions that will be made available to operations run in a worker.
 * @property {number} [threads] By default, operations will be run in a single worker thread.
 * To avoid using workers altogether, set `threads: 0`.  For pixel operations, operations can
 * be run in multiple worker threads.  Note that there is additional overhead in
 * transferring data to multiple workers, and that depending on the user's
 * system, it may not be possible to parallelize the work.
 * @property {RasterOperationType} [operationType='pixel'] Operation type.
 * Supported values are `'pixel'` and `'image'`.  By default,
 * `'pixel'` operations are assumed, and operations will be called with an
 * array of pixels from input sources.  If set to `'image'`, operations will
 * be called with an array of ImageData objects from input sources.
 * @property {Array<number>|null} [resolutions] Resolutions. If specified, raster operations will only
 * be run at the given resolutions.  By default, the resolutions of the first source with resolutions
 * specified will be used, if any. Set to `null` to use any view resolution instead.
 */
/***
 * @template Return
 * @typedef {import("../Observable").OnSignature<import("../Observable").EventTypes, import("../events/Event.js").default, Return> &
 *   import("../Observable").OnSignature<import("../ObjectEventType").Types, import("../Object").ObjectEvent, Return> &
 *   import("../Observable").OnSignature<import("./Image.js").ImageSourceEventTypes, import("./Image.js").ImageSourceEvent, Return> &
 *   import("../Observable").OnSignature<RasterSourceEventTypes, RasterSourceEvent, Return> &
 *   import("../Observable").CombinedOnSignature<import("../Observable").EventTypes|import("../ObjectEventType").Types
 *     |RasterSourceEventTypes, Return>} RasterSourceOnSignature
 */
/**
 * @classdesc
 * A source that transforms data from any number of input sources using an
 * {@link module:ol/source/Raster~Operation} function to transform input pixel values into
 * output pixel values.
 *
 * @fires module:ol/source/Raster.RasterSourceEvent
 * @api
 */
declare class RasterSource extends ImageSource {
    /**
     * @param {Options} options Options.
     */
    constructor(options: Options);
    /***
     * @type {RasterSourceOnSignature<import("../events").EventsKey>}
     */
    on: RasterSourceOnSignature<import("../events").EventsKey>;
    /***
     * @type {RasterSourceOnSignature<import("../events").EventsKey>}
     */
    once: RasterSourceOnSignature<import("../events").EventsKey>;
    /***
     * @type {RasterSourceOnSignature<void>}
     */
    un: RasterSourceOnSignature<void>;
    /**
     * @private
     * @type {Processor}
     */
    private processor_;
    /**
     * @private
     * @type {RasterOperationType}
     */
    private operationType_;
    /**
     * @private
     * @type {number}
     */
    private threads_;
    /**
     * @private
     * @type {Array<import("../layer/Layer.js").default>}
     */
    private layers_;
    /** @type {boolean} */
    useResolutions_: boolean;
    /**
     * @private
     * @type {import("../TileQueue.js").default}
     */
    private tileQueue_;
    /**
     * The most recently requested frame state.
     * @type {import("../Map.js").FrameState}
     * @private
     */
    private requestedFrameState_;
    /**
     * The most recently rendered image canvas.
     * @type {import("../ImageCanvas.js").default}
     * @private
     */
    private renderedImageCanvas_;
    /**
     * The most recently rendered revision.
     * @type {number}
     */
    renderedRevision_: number;
    /**
     * @private
     * @type {import("../Map.js").FrameState}
     */
    private frameState_;
    /**
     * Set the operation.
     * @param {Operation} operation New operation.
     * @param {Object} [lib] Functions that will be available to operations run
     *     in a worker.
     * @api
     */
    setOperation(operation: Operation, lib?: any): void;
    /**
     * Update the stored frame state.
     * @param {import("../extent.js").Extent} extent The view extent (in map units).
     * @param {number} resolution The view resolution.
     * @param {import("../proj/Projection.js").default} projection The view projection.
     * @return {import("../Map.js").FrameState} The updated frame state.
     * @private
     */
    private updateFrameState_;
    /**
     * Determine if all sources are ready.
     * @return {boolean} All sources are ready.
     * @private
     */
    private allSourcesReady_;
    /**
     * @param {import("../extent.js").Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("../proj/Projection.js").default} projection Projection.
     * @return {import("../ImageCanvas.js").default} Single image.
     */
    getImage(extent: import("../extent.js").Extent, resolution: number, pixelRatio: number, projection: import("../proj/Projection.js").default): import("../ImageCanvas.js").default;
    /**
     * Start processing source data.
     * @private
     */
    private processSources_;
    /**
     * Called when pixel processing is complete.
     * @param {import("../Map.js").FrameState} frameState The frame state.
     * @param {Error} err Any error during processing.
     * @param {ImageData} output The output image data.
     * @param {Object|Array<Object>} data The user data (or an array if more than one thread).
     * @private
     */
    private onWorkerComplete_;
    /**
     * @param {import("../proj/Projection").default} [projection] Projection.
     * @return {Array<number>|null} Resolutions.
     */
    getResolutions(projection?: import("../proj/Projection.js").default | undefined): Array<number> | null;
}
import ImageSource from "./Image.js";
//# sourceMappingURL=Raster.d.ts.map