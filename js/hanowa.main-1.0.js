import * as THREE from '/build/three.module.js';

import Stats from '/examples/jsm/libs/stats.module.js';

import {
    OrbitControls
} from '/examples/jsm/controls/OrbitControls.js';

import {
    FlyControls
} from '/examples/jsm/controls/FlyControls.js';

import {
    PCDLoader
} from '/examples/jsm/loaders/PCDLoader.js';

var container, stats;
var camera, camera2, controls, scene, renderer, parentScene;
var boxes = [];
var currentFrame = 0;
let pcdFiles = [
    'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000000.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000001.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000002.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000003.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000004.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000005.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000006.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000007.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000008.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000009.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000010.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000011.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000012.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000013.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000014.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000015.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000016.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000017.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000018.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000019.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000020.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000021.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000022.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000023.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000024.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000025.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000026.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000027.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000028.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000029.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000030.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000031.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000032.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000033.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000034.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000035.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000036.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000037.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000038.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000039.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000040.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000041.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000042.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000043.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000044.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000045.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000046.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000047.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000048.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000049.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000050.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000051.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000052.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000053.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000054.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000055.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000056.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000057.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000058.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000059.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000060.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000061.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000062.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000063.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000064.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000065.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000066.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000067.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000068.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000069.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000070.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000071.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000072.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000073.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000074.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000075.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000076.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000077.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000078.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000079.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000080.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000081.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000082.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000083.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000084.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000085.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000086.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000087.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000088.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000089.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000090.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000091.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000092.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000093.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000094.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000095.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000096.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000097.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000098.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000099.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000100.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000101.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000102.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000103.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000104.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000105.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000106.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000107.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000108.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000109.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000110.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000111.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000112.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000113.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000114.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000115.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000116.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000117.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000118.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000119.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000120.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000121.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000122.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000123.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000124.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000125.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000126.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000127.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000128.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000129.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000130.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000131.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000132.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000133.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000134.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000135.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000136.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000137.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000138.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000139.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000140.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000141.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000142.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000143.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000144.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000145.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000146.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000147.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000148.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000149.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000150.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000151.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000152.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000153.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000154.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000155.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000156.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000157.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000158.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000159.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000160.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000161.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000162.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000163.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000164.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000165.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000166.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000167.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000168.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000169.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000170.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000171.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000172.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000173.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000174.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000175.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000176.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000177.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000178.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000179.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000180.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000181.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000182.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000183.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000184.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000185.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000186.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000187.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000188.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000189.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000190.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000191.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000192.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000193.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000194.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000195.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000196.bin',
'https://scalar-prod.s3.ap-south-1.amazonaws.com/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar/frame_00000197.bin'
]

init();
animate();

function init() {
    pcdLoader(pcdFiles);

    parentScene = new THREE.Scene();
    parentScene.background = new THREE.Color(0x000000);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    parentScene.add(scene);
    camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.01, 8000);

    //camera.up.set(0, 0, 1);
    camera.position.set(-54, 0, 19);
    camera.rotation.set(0, -Math.PI / 2.5, -Math.PI / 2);

    scene.add(camera);
    var axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    container = document.getElementById("intro");

    container.appendChild(renderer.domElement);

    /*controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 0.3;
    controls.rollSpeed = Math.PI / 720;
    controls.autoForward = false;
    controls.dragToLook = false;*/

    /*controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.08;
    controls.keyPanSpeed = 40;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 5000;
    controls.maxPolarAngle = Math.PI;
    controls.keys = {
        LEFT: 65, //left arrow
        UP: 87, // up arrow
        RIGHT: 68, // right arrow
        BOTTOM: 83 // down arrow
    }
    // movement - please calibrate these values

    //controls.autoRotate = true;
    // world

    //stats = new Stats();
    //container.appendChild( stats.dom );*/

    window.addEventListener('keypress', keyboard);

    window.addEventListener('resize', onWindowResize, false);

  loadJSON(function(response) {
  // Parse JSON string into object
    boxes = JSON.parse(response);
    boxes.forEach(function(frame) {
        frame['boxes'].forEach(function(box){
            var geometry = new THREE.BoxGeometry(box.dimensions.length, box.dimensions.width, box.dimensions.height);
            //var tempColor = box.color.split('(')[1].split(')')[0].split(',');
            var tempColor = [10, 234, 123];
            var cubeColor = parseInt(tempColor[2]) * 65536 + parseInt(tempColor[1]) * 256 + parseInt(tempColor[0]);
            var material = new THREE.MeshBasicMaterial({
                color: cubeColor,
                transparent: true,
                opacity: 0.2
            });
            var cube = new THREE.Mesh(geometry, material);
            if (frame.frame_id != currentFrame) {
                cube.visible = false;
            }
            scene.add(cube);
            cube.name = "box" + frame.frame_id;
            cube.position.x = box.center.x;
            cube.position.y = box.center.y;
            cube.position.z = box.center.z;
            cube.rotation.x = box.rotation.x;
            cube.rotation.y = box.rotation.y;
            cube.rotation.z = box.rotation.z;
        })

    })
 });



    //add some lighting
    // var ambientLight = new THREE.AmbientLight(0xffffff);
    // scene.add(ambientLight);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();

}

function keyboard(ev) {

    var points = scene.getObjectByName(currentFrame);
    switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {

        case ']':
            for (var i = 0; i < pcdFiles.length; i++) {
                points = scene.getObjectByName(i);
                points.material.size *= 1.1;
                points.material.needsUpdate = true;
            }

            break;

        case '[':
            for (var i = 0; i < pcdFiles.length; i++) {
                points = scene.getObjectByName(i);
                points.material.size /= 1.1;
                points.material.needsUpdate = true;
            }
            break;

        case 16:
            controls.movementSpeed = 10;
            break;

        case '=':
            if (!(typeof scene === 'undefined') && currentFrame < pcdFiles.length - 1) {

                scene.getObjectByName(currentFrame).visible = false;
                scene.children.forEach(function(cube) {
                    if (cube.name == 'box' + currentFrame) {
                        cube.visible = false;
                    }
                })
                currentFrame += 1;
                scene.getObjectByName(currentFrame).visible = true;
                scene.children.forEach(function(cube) {
                    if (cube.name == 'box' + currentFrame) {
                        cube.visible = true;
                    }
                })
            }
            break;

        case '-':
            if (!(typeof scene === 'undefined') && currentFrame >= 1) {
                scene.getObjectByName(currentFrame).visible = false;
                scene.children.forEach(function(cube) {
                    if (cube.name == 'box' + currentFrame) {
                        cube.visible = false;
                    }
                })
                currentFrame -= 1;
                scene.getObjectByName(currentFrame).visible = true;
                scene.children.forEach(function(cube) {
                    if (cube.name == 'box' + currentFrame) {
                        cube.visible = true;
                    }
                })
            }
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);
    //controls.update(1);
    renderer.render(scene, camera);
    //stats.update();
}

function pcdLoader(pcdFiles) {
    var loader = new PCDLoader();
    pcdFiles.forEach(async function(pcdFile, idx) {
        loader.load(pcdFile, function(points) {
            points.material.color.setHex(16777215);
            points.material.size = 0.2;
            points.name = idx;
            if (idx > 0) {
                points.visible = false;
            }
            scene.add(points);
        });
    })
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://s3-ap-south-1.amazonaws.com/scalar-prod/public/waymo/segment-1208303279778032257_1360_000_1380_000/lidar_labels/segment-1208303279778032257_1360_000_1380_000_lidar_labels.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }
