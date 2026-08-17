# Phase A 技术来源

本项目优先依据原始论文、官方仓库与官方文档。课程文字是面向初学者的重新组织与解释，不把随机博客或内容农场当作权威来源。

## 图像、张量与卷积

1. PyTorch 官方文档，**Tensors**：https://docs.pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html  
   用于张量、shape、batch 等基础表述。注意框架可能使用不同维度顺序，课程以检测中常见的 NCHW 为主。
2. PyTorch 官方文档，**torch.nn.Conv2d**：https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html  
   用于 Conv2d 参数、输入输出形状、stride 与 padding。
3. He et al., **Deep Residual Learning for Image Recognition**, CVPR 2016：https://arxiv.org/abs/1512.03385  
   残差连接与 ResNet 的原始论文；原始 DETR 使用 ResNet Backbone。

## 检测任务与评价

4. Lin et al., **Microsoft COCO: Common Objects in Context**, ECCV 2014：https://arxiv.org/abs/1405.0312  
   COCO 数据集原始论文。
5. COCO 官方评估实现：https://github.com/cocodataset/cocoapi  
   用于 COCO 风格 AP、IoU 阈值和评估约定。AP50:95 的课程解释遵循 COCO 评估习惯。
6. Everingham et al., **The Pascal Visual Object Classes (VOC) Challenge**, IJCV 2010：http://host.robots.ox.ac.uk/pascal/VOC/pubs/everingham10.pdf  
   目标检测评估历史背景与 Precision–Recall/AP。

## Transformer

7. Vaswani et al., **Attention Is All You Need**, NeurIPS 2017：https://arxiv.org/abs/1706.03762  
   Transformer、scaled dot-product attention、multi-head attention 和 encoder-decoder 的首要来源。

## DETR

8. Carion et al., **End-to-End Object Detection with Transformers**, ECCV 2020：https://arxiv.org/abs/2005.12872  
   DETR 数据流、集合预测、Object Queries、二分图匹配与无需传统 NMS 的首要来源。
9. Facebook Research，**DETR 官方实现**：https://github.com/facebookresearch/detr  
   用于核对模型结构、输出、matcher、损失以及 no-object 实现。该仓库现为只读归档，但仍是原始官方实现。
10. DETR 官方代码，`models/detr.py`：https://github.com/facebookresearch/detr/blob/main/models/detr.py  
    `SetCriterion` 明确说明先计算 Hungarian assignment，再监督匹配对；模型代码也展示 class 与 box heads。
11. Kuhn, **The Hungarian Method for the Assignment Problem**, 1955：https://doi.org/10.1002/nav.3800020109  
    匈牙利方法的经典论文。课程只讲匹配直觉，不展开算法证明。

## 路线图中仅定位、Phase A 不展开

12. Redmon et al., **You Only Look Once: Unified, Real-Time Object Detection**, CVPR 2016：https://arxiv.org/abs/1506.02640  
13. Lv et al., **DETRs Beat YOLOs on Real-time Object Detection (RT-DETR)**：https://arxiv.org/abs/2304.08069  
14. Peng et al., **D-FINE: Redefine Regression Task in DETRs as Fine-grained Distribution Refinement**：https://arxiv.org/abs/2410.13842  

这些条目只用于说明首页技术路线的位置，不在 Phase A 教授其结构、训练或研究改进。

## 表述边界

- “原始 DETR 不需要 NMS”指其论文与标准管线通过一对一集合预测避免传统 NMS，不外推为所有后续实现的绝对规则。
- Attention 互动图中的权重是为了建立直觉而设计的示意数值，不是训练模型生成的可解释性结论。
- CNN 互动图简化为单通道小矩阵；真实卷积层会跨输入通道计算，并使用多组可学习 kernels。
