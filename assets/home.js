const mapCopy={
  cv:['Computer Vision（计算机视觉）','让计算机从图像或视频中提取有用信息的领域。目标检测只是它众多任务中的一种。'],
  od:['Object Detection（目标检测）','不仅回答“图里有什么”，还要用边界框回答“它在哪里”。'],
  families:['YOLO / DETR','两类重要检测思路：YOLO 常把检测组织成密集预测；DETR 把它看成一个集合预测问题。本阶段重点搭建理解 DETR 所需的地基。'],
  rtdetr:['RT-DETR','面向实时检测的 DETR 系方法。它属于后续阶段，本阶段只记住它位于 DETR 之后即可。'],
  dfine:['D-FINE','在 DETR 系列基础上发展的检测器。现在不展开结构，也不训练。'],
  uav:['UAV Aerial Object Detection','把检测器用于无人机航拍图像：目标往往更小、更密集，视角也与地面照片不同。这是最终应用场景。']
};
const out=document.querySelector('#map-explainer');
function showMap(key){const [title,body]=mapCopy[key];out.innerHTML=`<strong>${title}</strong><span>${body}</span>`;document.querySelectorAll('.map-node').forEach(n=>n.classList.toggle('active',n.dataset.map===key));}
document.querySelectorAll('.map-node').forEach(n=>n.addEventListener('click',()=>showMap(n.dataset.map)));
showMap('cv');
