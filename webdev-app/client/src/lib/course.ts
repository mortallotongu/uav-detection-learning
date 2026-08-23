/* Style reminder: Research Notebook — this file supplies a single continuous teaching spine, never a loose glossary. Every concept answers why → how → what to notice. */

export type Lesson = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  why: string;
  explain: string[];
  takeaways: string[];
  check: string;
  lab?: "box" | "tensor" | "attention" | "distribution";
  terms: string[];
};

export type Chapter = {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  lessons: Lesson[];
};

export const chapters: Chapter[] = [
  {
    id: "task",
    number: "01",
    title: "先看懂检测任务",
    description: "先不谈模型。先知道模型到底要交出什么答案，以及什么叫“定位得准”。",
    color: "coral",
    lessons: [
      {
        id: "task-output",
        eyebrow: "THE QUESTION",
        title: "目标检测究竟在预测什么？",
        summary: "一张航拍图里可能有很多目标。检测器要同时回答：它们是什么，以及它们在哪里。",
        why: "如果不知道输出是什么，后面看到分类头、回归头、匹配和损失时，就只能记名词。",
        explain: [
          "目标检测不是给整张图贴一个标签，而是输出一组实例。每个实例至少包含一个类别和一个边界框；边界框通常用左上角、右下角，或中心点、宽度和高度表示。",
          "所以检测任务天然有两件事：分类（class）负责“是什么”，定位（localization）负责“在哪里”。模型还会给出一个分数，表示它对这个预测的信心。",
          "在无人机图像中，一张图可能同时有许多很小、互相遮挡的行人、汽车和自行车。检测器不是只找一个最显眼的物体，而是要尽量把这一组目标都交出来。",
        ],
        takeaways: ["一个预测 = 类别 + 位置 + 分数", "检测输出的数量不是预先知道的真实目标数量", "分类正确不代表框的位置也正确"],
        check: "拿到一个预测框时，你能分别指出它的 class、box 和 confidence 吗？",
        lab: "box",
        terms: ["Bounding Box", "Class", "Confidence", "Localization"],
      },
      {
        id: "iou",
        eyebrow: "THE MEASURE",
        title: "IoU：一个框到底有多准？",
        summary: "IoU 不问模型有多自信，只比较预测框和真实框重叠得有多好。",
        why: "D-FINE 最终改进的是定位。你必须先能看出一个框是“找到了”还是“找准了”。",
        explain: [
          "真实框可以理解为标注者认为目标所在的区域，预测框是模型画出的区域。IoU（Intersection over Union）用交集面积除以并集面积：IoU = 交集 / 并集。",
          "两个框完全重合时 IoU=1；完全没有重叠时 IoU=0。框只要稍微移动，交集和并集就会变化。对于大目标，移动几像素可能影响不大；对于很小的目标，同样的移动可能让重叠比例大幅下降。",
          "评估时需要先规定 IoU 阈值。例如 AP50 使用 0.50 作为匹配门槛；COCO 风格 AP50:95 则在 0.50、0.55 一直到 0.95 多个阈值上综合判断。这里的 50:95 是 IoU 阈值，不是置信度。",
        ],
        takeaways: ["IoU 衡量两个框的重叠质量", "小目标对定位误差更敏感", "AP50 比较宽松，AP75 更看重定位精度"],
        check: "拖动演示里的橙色框，让它分别经历高 IoU、低 IoU 和完全不重叠。",
        lab: "box",
        terms: ["IoU", "Ground Truth", "AP50", "AP75"],
      },
      {
        id: "metrics",
        eyebrow: "THE SCOREBOARD",
        title: "Precision、Recall 与 AP：别只盯一个数字",
        summary: "有的模型很谨慎但漏检多，有的模型敢报但误检多。指标是在描述不同的错误。",
        why: "之后分析 D-FINE 时，你需要知道 AP 上升到底意味着少漏检、少误检，还是框变准了。",
        explain: [
          "TP 是正确检测，FP 是模型报了但不该报，FN 是真实目标存在但模型没有找出来。Precision = TP/(TP+FP)，回答“我报出来的有多少是真的”；Recall = TP/(TP+FN)，回答“真的目标我找回了多少”。",
          "调低置信度阈值，通常会找回更多目标，但也可能带来更多误检；调高阈值则可能更谨慎。PR 曲线把这种取舍画出来，AP 是对曲线的整体概括。",
          "在无人机检测中，整体 AP 之外还要看 APs、APm、APl。它们按目标面积划分，能提示模型是不是主要在大目标上表现好，而小目标仍然困难。",
        ],
        takeaways: ["Precision 关注误检，Recall 关注漏检", "AP 综合了不同置信度阈值下的表现", "小目标研究不能只看 overall AP"],
        check: "如果模型找到了所有目标，但多画了很多不存在的框，哪个指标更可能受损？",
        terms: ["TP", "FP", "FN", "Precision", "Recall", "APs"],
      },
    ],
  },
  {
    id: "feature",
    number: "02",
    title: "图像如何变成特征",
    description: "从像素、张量和卷积出发，理解 Backbone 为什么要把空间变小、通道变多。",
    color: "sage",
    lessons: [
      {
        id: "tensor",
        eyebrow: "THE INPUT",
        title: "模型眼中的图像：N × C × H × W",
        summary: "对人来说是一张图片，对网络来说是一组有形状的数字。",
        why: "读任何检测器代码，第一件事都是追踪张量的 shape。shape 错了，后面的模块就没有意义。",
        explain: [
          "一张 RGB 图像可以看作三个通道叠在一起：红、绿、蓝。深度学习代码通常用 N×C×H×W 表示一批图像：N 是图片数量，C 是通道数，H 是高度，W 是宽度。",
          "例如 1×3×640×640 表示一张 640×640 的彩色图片。网络中间层可能变成 1×64×160×160：空间网格变粗了，但每个位置有 64 个学习出的特征通道。",
          "这 64 个通道不是 64 种颜色，而是模型对边缘、纹理、局部结构和更复杂模式的不同响应。通道数量增加，是用更多表示维度换取更丰富的特征。",
        ],
        takeaways: ["N 是 batch，C 是通道，H/W 是空间尺寸", "空间尺寸和通道数量表达不同类型的信息", "Feature Map 是响应数字，不是另一张普通照片"],
        check: "把 1×3×640×640 的每一个轴说给别人听，再解释为什么中间层可能变成 1×64×160×160。",
        lab: "tensor",
        terms: ["Tensor", "Shape", "Channel", "Feature Map", "Backbone"],
      },
      {
        id: "conv",
        eyebrow: "THE OPERATOR",
        title: "卷积：用一个小窗口寻找局部模式",
        summary: "Kernel 在图像上滑动，每个位置都计算一次“这里像不像我正在寻找的模式”。",
        why: "D-FINE 仍然需要 Backbone 从图像提取特征。不了解卷积，就不知道定位信息从哪里来。",
        explain: [
          "一个 3×3 kernel 是一组可学习的数字。它覆盖输入中的一个局部区域，逐元素相乘后求和，再加上 bias，得到一个输出数值。窗口移动到所有位置，输出数值排成一张 Feature Map。",
          "训练开始时，kernel 的数字并不知道该找什么；通过损失和梯度更新，它们逐渐学会对某些边缘、角点、纹理或部件产生更强响应。不同 kernel 可以学到不同模式。",
          "stride 决定窗口移动的步幅，padding 决定边缘是否补值。下采样可以降低计算量并扩大有效视野，但也会让很小的目标只剩下很少的空间位置。",
        ],
        takeaways: ["Kernel 是共享的可学习权重", "Feature Map 记录每个位置的模式响应", "下采样节省计算，但可能损失小目标细节"],
        check: "如果一个目标在下采样后只剩 2×2 个特征位置，为什么它的定位会更困难？",
        terms: ["Convolution", "Kernel", "Stride", "Padding", "Downsampling"],
      },
      {
        id: "multiscale",
        eyebrow: "THE RESOLUTION",
        title: "多尺度特征：同时保留细节和语义",
        summary: "高分辨率特征看得清小目标，低分辨率特征看得懂更大的上下文。",
        why: "VisDrone 的核心困难之一是目标小、密集、尺度变化大。D-FINE 的定位能力也离不开输入特征的质量。",
        explain: [
          "浅层特征通常空间分辨率较高，保留了边缘和局部细节，但语义较弱；深层特征空间分辨率较低，却经过更多层处理，能表达更强的目标语义和上下文。",
          "多尺度检测会同时使用不同空间步长的特征层。以 640×640 为例，stride 4、8、16、32 的特征图空间尺寸可以近似为 160×160、80×80、40×40、20×20。",
          "FPN 一类结构的直觉，是把深层语义向高分辨率层传递，同时让不同尺度的特征互相补充。它不能凭空创造细节，但可以更好地利用还没有被完全压缩的空间信息。",
        ],
        takeaways: ["小目标需要足够的空间采样", "深层特征语义强但分辨率低", "多尺度特征是在细节和语义之间做信息合作"],
        check: "为什么一张 10×10 像素的目标比一张 200×200 像素的目标更容易受下采样影响？",
        terms: ["Multi-scale", "FPN", "Stride", "Receptive Field", "Small Object"],
      },
    ],
  },
  {
    id: "training",
    number: "03",
    title: "模型如何学会预测",
    description: "把“神经网络在训练”还原成一条可以解释的循环：预测、算错、传回、更新。",
    color: "ochre",
    lessons: [
      {
        id: "loop",
        eyebrow: "THE LOOP",
        title: "训练不是记忆答案，而是在调整参数",
        summary: "模型先用当前参数做预测，再用损失告诉它哪里不对，最后沿着梯度更新参数。",
        why: "只有理解训练循环，你才能看懂 D-FINE 的复杂损失，而不是把 loss 日志当作温度计。",
        explain: [
          "神经网络包含大量可学习参数。给定输入后，参数决定前向传播的输出；输出和标注之间的差异被压缩成一个或多个损失值。",
          "梯度描述“参数稍微改变时，损失会向哪个方向变化”。反向传播把最终损失对各层参数的影响传回去，优化器再按梯度更新参数。",
          "这套循环重复很多次。epoch 是完整看过一次训练集，batch 是一次送入的样本集合，iteration 或 step 通常指一次参数更新。它们不是同一个概念。",
        ],
        takeaways: ["Loss 是优化目标，不是最终评价指标", "Gradient 把误差信息传回参数", "Batch、step、epoch 描述不同尺度的训练过程"],
        check: "为什么训练 loss 下降并不能单独证明模型在验证集上变好了？",
        terms: ["Forward Pass", "Loss", "Gradient", "Backpropagation", "Optimizer"],
      },
      {
        id: "losses",
        eyebrow: "THE ERROR",
        title: "分类损失和定位损失在惩罚什么？",
        summary: "一个模型可能类别猜对了但框很偏，也可能框很准但类别错了。损失要分别表达这些错误。",
        why: "D-FINE 的关键改变发生在边界框回归。理解普通回归损失，才能理解它为什么要换一种表达。",
        explain: [
          "分类损失关注类别概率是否合理；框回归损失关注预测框与目标框之间的位置差异。IoU、L1、GIoU 等量化方式各有侧重，工程中往往组合使用。",
          "一个总损失通常是多个目标的加权和。日志里的不同 loss 项不是越多越高级，而是代表模型在同时学习不同约束：类别、边界、辅助层或更细粒度的定位目标。",
          "训练时的 loss 需要结合验证集预测来解释。单个 loss 变小，不必然意味着最终 AP 同比例变大；真正的问题是它是否改善了模型的错误类型。",
        ],
        takeaways: ["分类和定位是不同的误差", "总损失可能由多个目标组合而成", "损失曲线必须和预测结果、AP 一起看"],
        check: "一个框类别正确但位置明显偏移，应该优先怀疑分类损失还是定位损失？",
        terms: ["Classification Loss", "Box Loss", "GIoU", "Auxiliary Loss", "Weight"],
      },
      {
        id: "pretrain",
        eyebrow: "THE STARTING POINT",
        title: "预训练和微调：为什么不从随机参数开始？",
        summary: "先在更大的数据上学通用视觉表示，再在目标数据上调整，是检测中常见的起点。",
        why: "D-FINE 官方仓库同时提供不同预训练来源。你需要能区分“模型结构”和“训练起点”。",
        explain: [
          "随机初始化意味着模型一开始还不知道边缘、纹理和物体结构。预训练模型已经在其他数据上形成了一部分通用表示，微调则让它适应新的类别、分布和任务。",
          "预训练不是保证提升的魔法。预训练数据和目标数据差异很大、类别过于简单或训练策略不合适时，也可能出现收益有限甚至过拟合。",
          "学习率、数据增强、训练时长和验证集划分都属于训练协议。比较两个结果时，不能只说“模型 A 比模型 B 好”，还要确认这些条件是否一致。",
        ],
        takeaways: ["结构、权重和训练协议是三件事", "预训练提供起点，微调完成适配", "公平比较需要控制训练条件"],
        check: "如果只更换了预训练权重，其他条件不变，你比较的是什么因素？",
        terms: ["Pretraining", "Fine-tuning", "Initialization", "Generalization", "Overfitting"],
      },
    ],
  },
  {
    id: "detr",
    number: "04",
    title: "从候选框到集合预测",
    description: "理解 DETR 为什么要摆脱传统的候选框和 NMS，并把检测写成集合到集合的预测。",
    color: "blue",
    lessons: [
      {
        id: "nms",
        eyebrow: "BEFORE DETR",
        title: "NMS 解决的是什么麻烦？",
        summary: "传统检测器往往会对同一个目标报出多个重叠框，需要一个后处理步骤把它们合并或筛掉。",
        why: "不理解 NMS，就无法真正理解 DETR 所谓“端到端、减少手工组件”的变化。",
        explain: [
          "许多传统检测器会在不同位置产生候选框。同一个汽车附近可能出现多个框，模型需要根据分数排序，再用 IoU 判断哪些框太重叠，保留分数最高的一个并抑制其他框。",
          "NMS 很实用，但它是预测之后额外发生的规则。阈值需要设定；在密集目标或目标彼此靠近时，过度抑制可能误伤本来属于不同实例的框。",
          "DETR 的目标不是简单地把 NMS 换成另一个阈值，而是让模型直接输出一个目标集合，并用训练时的一对一匹配减少重复预测。",
        ],
        takeaways: ["NMS 是对重复候选框的后处理", "它依赖分数和 IoU 阈值", "DETR 尝试从训练目标层面减少重复预测"],
        check: "如果两个相邻行人的框有较高 IoU，为什么简单 NMS 可能比较危险？",
        terms: ["NMS", "Candidate Box", "Post-processing", "Duplicate Prediction"],
      },
      {
        id: "set",
        eyebrow: "THE REFRAME",
        title: "DETR：把检测看成集合预测",
        summary: "模型不再先产生一堆候选框再去重，而是直接输出固定数量的预测槽位。",
        why: "这是 D-FINE 的理论家族。D-FINE 不是孤立的新模型，而是在 DETR 检测框架中重新定义定位回归。",
        explain: [
          "DETR 使用 CNN Backbone 提取图像特征，再通过 Transformer encoder-decoder 处理全局关系。Decoder 接收一组可学习的 object queries，每个 query 最终对应一个潜在目标槽位。",
          "预测槽位数量固定，但一张图中的真实目标数量不固定。因此，一部分槽位会负责真实目标，剩余槽位学习输出 no-object。",
          "关键在于训练时如何把预测集合与真实目标集合对应起来。DETR 使用二分图匹配，为每个真实目标寻找一个最合适的预测，形成一对一的监督。",
        ],
        takeaways: ["DETR 直接预测一个集合", "Object Query 是目标级预测槽位", "固定槽位通过 no-object 容纳不同数量的目标"],
        check: "为什么 DETR 需要 no-object？因为预测槽位数量固定，而真实目标数量会变化。",
        terms: ["DETR", "Set Prediction", "Object Query", "No-object", "End-to-end"],
      },
      {
        id: "matching",
        eyebrow: "THE ASSIGNMENT",
        title: "Hungarian Matching：谁负责哪个目标？",
        summary: "匹配不是按预测框的编号硬对齐，而是在全局寻找一组代价较低的一对一分配。",
        why: "如果没有匹配，模型不知道第 7 个 query 应该学习哪一个真实目标，集合预测就无法训练。",
        explain: [
          "假设图像中有 3 个真实目标和 100 个预测槽位。匹配算法会综合类别代价和框的位置代价，寻找一组总成本较低的配对，让每个真实目标最多对应一个预测。",
          "这类问题叫二分图匹配，Hungarian algorithm 是常用的求解方法。匹配本身不是最终检测结果，它是训练时决定“谁和谁比较”的步骤。",
          "匹配之后，被选中的预测会收到目标类别和框的监督；没有匹配到真实目标的槽位通常学习 no-object。这样模型可以直接从集合层面学习去重。",
        ],
        takeaways: ["匹配解决预测槽位与真实目标的对应关系", "代价通常同时考虑类别和定位", "匹配发生在训练监督过程中"],
        check: "为什么不能简单规定“第一个 query 对应第一个真实框”？因为集合本身没有稳定顺序。",
        terms: ["Bipartite Matching", "Hungarian Algorithm", "Matching Cost", "Assignment"],
      },
    ],
  },
  {
    id: "transformer",
    number: "05",
    title: "让全局信息互相交流",
    description: "只学 DETR 真正用到的 Transformer：特征如何交流，查询如何从图像中读取目标信息。",
    color: "purple",
    lessons: [
      {
        id: "tokens",
        eyebrow: "THE REPRESENTATION",
        title: "Feature Map 如何变成 Token？",
        summary: "Transformer 不直接处理二维图片，而是处理一串带有位置的向量。",
        why: "看到 flatten、permute 或 positional encoding 时，你要知道它们是在把空间特征整理成序列。",
        explain: [
          "一个 Feature Map 有很多空间位置。每个位置可以看作一个视觉 token，携带该位置的通道向量。将 H×W 个位置排成序列后，Transformer 就能在这些 token 之间计算关系。",
          "向量的维度不是“意义标签”，而是一组供网络计算的表示。线性层可以把原始特征投影到另一个维度，形成更适合注意力运算的表示。",
          "展平会暂时改变数据的排列方式，但不会自动让模型知道上下左右。位置编码或位置特征为 token 提供空间身份，否则两个相同内容但位置不同的 token 很难被区分。",
        ],
        takeaways: ["Token 是序列中的基本处理单元", "视觉 token 可以来自 Feature Map 的空间位置", "位置编码补充空间顺序信息"],
        check: "如果把特征图展平后不提供位置线索，模型会失去什么信息？",
        terms: ["Token", "Embedding", "Linear Projection", "Flatten", "Positional Encoding"],
      },
      {
        id: "attention",
        eyebrow: "THE READ",
        title: "Attention：我应该从哪里读取信息？",
        summary: "Query 提出当前需求，Key 提供可比较的索引，Value 携带真正被汇总的内容。",
        why: "Object Query 的行为建立在 Attention 的读信息机制之上。先理解“查找”，再理解“检测目标槽位”。",
        explain: [
          "可以把注意力想成资料检索：Query 是当前问题，Key 是每份资料的索引，Value 是资料内容。Query 与 Key 越相似，对应位置得到的权重通常越高，最后按权重加权汇总 Value。",
          "公式是 Attention(Q,K,V)=softmax(QKᵀ/√dₖ)V。第一次学习时，只要抓住三步：计算相似度，归一化为权重，按权重读取内容。除以 √dₖ 是为了控制点积尺度，让 softmax 不至于过早饱和。",
          "Self-attention 中 Q、K、V 来自同一个序列；cross-attention 中 Q 和 K/V 来自不同来源。DETR Decoder 中的 query 会通过 cross-attention 从图像特征中读取信息。",
        ],
        takeaways: ["注意力是相似度驱动的信息读取", "Q/K/V 是计算角色，不是固定的人类语义", "Self 与 Cross 的关键区别是 Q 和 K/V 的来源"],
        check: "在演示中切换 query，观察它关注的 key 改变；这就是“当前查询需要不同信息”的直觉。",
        lab: "attention",
        terms: ["Query", "Key", "Value", "Softmax", "Self-attention", "Cross-attention"],
      },
      {
        id: "decoder",
        eyebrow: "THE OBJECT SLOT",
        title: "Object Query：一个可学习的目标槽位",
        summary: "DETR 的 object query 不是一个真实目标框，而是一组等待从图像中读出目标信息的向量。",
        why: "这是最容易被混淆的概念：Attention 里的 Query 和 DETR 的 Object Query 有联系，但不是同一个层级的概念。",
        explain: [
          "DETR 提供固定数量的可学习 query 向量。它们一开始并没有分别绑定“汽车 1”或“行人 2”；训练后，它们学会作为不同的目标预测槽位参与竞争和分工。",
          "Decoder 先让 query 之间通过 self-attention 互相交流，再通过 cross-attention 去读取 encoder 产生的图像 memory。读取后，每个 query 经过预测头输出类别和边界框。",
          "因此，一个 object query 更像一个“我要找一个目标”的工作台，而不是图片中的一个预先存在的物体。最后它是否对应真实目标，要由匹配结果决定。",
        ],
        takeaways: ["Object Query 是可学习的预测槽位", "它通过 cross-attention 读取图像特征", "query 的目标身份由训练匹配逐渐形成"],
        check: "Object Query 是不是输入图像中的某个像素？不是，它是模型中的可学习向量。",
        terms: ["Object Query", "Decoder", "Memory", "Prediction Head", "Query Slot"],
      },
    ],
  },
  {
    id: "localization",
    number: "06",
    title: "DETR 如何学会精确定位",
    description: "从一对一监督走到边界框回归、辅助损失和去噪训练，准备进入 D-FINE 的定位问题。",
    color: "ink",
    lessons: [
      {
        id: "regression",
        eyebrow: "THE COORDINATE",
        title: "边界框回归：从特征到坐标",
        summary: "预测头把目标级向量转换成框的四个参数，但“直接回归坐标”并不等于定位问题已经解决。",
        why: "D-FINE 的创新点就在于重新定义回归任务。你需要先知道它要替换的旧范式是什么。",
        explain: [
          "每个 object query 最终得到一个目标级表示，框预测头把它映射为四个数，例如中心点坐标、宽度和高度，或经过变换后的边界坐标。",
          "直接回归把定位看成从特征向量到连续坐标的映射。它简洁，但单个连续数值不容易表达“这个边界大概在哪一段”“当前定位有多不确定”等中间信息。",
          "在小目标中，边界的一点偏移可能让 IoU 下降很多。因此定位质量不仅取决于“有没有找到目标”，也取决于模型能不能持续修正边缘位置。",
        ],
        takeaways: ["框回归把目标表示映射为四个几何参数", "直接坐标回归表达的中间定位信息有限", "小目标把定位误差放大成评估差异"],
        check: "为什么分类正确的预测仍然可能有较低 AP？因为框的位置可能没有达到对应 IoU 阈值。",
        terms: ["Box Regression", "Coordinate", "Center", "Width", "Height"],
      },
      {
        id: "denoising",
        eyebrow: "THE TRAINING HELP",
        title: "去噪训练与辅助监督：让学习更容易开始",
        summary: "DETR 系列经常给训练过程额外的提示，让 query 更快学会从混乱输入中找到正确目标。",
        why: "D-FINE 日志中会出现 auxiliary、dn 等项目。先知道它们为什么存在，再看具体实现。",
        explain: [
          "DETR 的集合匹配在训练早期可能很难，因为 query 还不会产生稳定预测。去噪训练会从真实标注构造带噪声的目标输入，让模型学习恢复原本的类别和位置。",
          "辅助损失会在 decoder 的中间层也施加监督，而不只是监督最后一层。这样更深层的预测目标能够向前传递，帮助整个堆叠结构学习。",
          "这些机制主要改善训练过程，不等于推理时增加了同样的额外输出。阅读论文时要区分 training-only 的帮助和 inference-time 的结构。",
        ],
        takeaways: ["去噪训练给早期匹配提供更容易的学习信号", "辅助损失让中间层也承担监督", "训练机制与推理结构不能混为一谈"],
        check: "一个只在训练时使用的去噪分支，是否一定会在推理时增加计算？不一定。",
        terms: ["Denoising Training", "Auxiliary Loss", "Decoder Layer", "Training Signal"],
      },
      {
        id: "localization-gap",
        eyebrow: "THE GAP",
        title: "为什么 D-FINE 要重新思考回归？",
        summary: "当任务真正关心边界位置时，模型不只需要“猜一个坐标”，还需要更细致地表达和修正定位。",
        why: "读 D-FINE 之前，先用一句话说出它针对的缺口：定位回归还可以更细粒度、更有过程感。",
        explain: [
          "DETR 框架已经解决了集合预测、查询和匹配问题，但边界框回归仍然是定位质量的关键。对于边缘模糊、尺寸很小或遮挡严重的目标，直接给出一个坐标可能不够细致。",
          "D-FINE 的出发点是把回归重新表述为细粒度的分布细化过程：模型不只是给出一个静态坐标，而是对边界位置的可能性进行更细的表达并逐步修正。",
          "这不是把分类和定位混为一谈，而是改变定位信息的表示方式。之后的 FDR 与 GO-LSD，分别对应更细粒度的分布 refinement 和定位知识的自蒸馏。",
        ],
        takeaways: ["D-FINE 继承 DETR 的集合预测框架", "它把主要变化放在边界框定位回归", "核心关键词是分布、细粒度、迭代细化和定位知识"],
        check: "进入下一章前，你能否用自己的话说明“直接坐标回归”和“分布细化”关注点的差异？",
        terms: ["Localization", "Distribution", "Refinement", "Precision", "Uncertainty"],
      },
    ],
  },
  {
    id: "dfine",
    number: "07",
    title: "D-FINE：把定位做成细化过程",
    description: "最后回到模型本身：FDR 如何细化位置分布，GO-LSD 如何传递定位知识，以及整条链如何闭合。",
    color: "coral",
    lessons: [
      {
        id: "fdr",
        eyebrow: "THE CORE IDEA",
        title: "FDR：Fine-grained Distribution Refinement",
        summary: "边界框回归不再只输出一个坐标，而是先表达位置分布，再让它逐步变得更精确。",
        why: "这是 D-FINE 最核心的设计。只记住缩写没有意义，必须抓住“分布为什么比单点更适合细化”。",
        explain: [
          "把一条边界的位置想成一组可能性：模型可能认为它落在相邻的几个细粒度位置上，而不是从一开始就绝对确定地落在某一个连续坐标。这样的表示可以保留更多定位过程中的信息。",
          "FDR 通过迭代式的 refinement，让较粗的定位逐步向更准确的位置收敛。分布的形状可以表达当前定位的集中程度，最终再转换成用于框表示的坐标。",
          "对小目标而言，边缘的一点变化非常重要。更细粒度的中间表达，目标是让模型在定位时拥有更可控的修正空间，而不是只能一次性跳到一个坐标。",
        ],
        takeaways: ["FDR 把定位表示为分布而不只是单点", "细化是逐步更新定位信息", "最终目标仍然是更准确的四条边界"],
        check: "拖动演示里的分布，观察峰值从宽变窄并向正确位置移动。这个过程就是“分布细化”的直觉。",
        lab: "distribution",
        terms: ["FDR", "Fine-grained", "Distribution", "Refinement", "Bounding Edge"],
      },
      {
        id: "go-lsd",
        eyebrow: "THE TEACHER WITHIN",
        title: "GO-LSD：让更好的定位结果教会前面的层",
        summary: "更深层的预测往往经过更多 refinement。GO-LSD 把定位知识反向传给较浅层，让整个预测链更会定位。",
        why: "只理解 FDR 还不完整。D-FINE 还要解决不同层之间如何共享定位能力。",
        explain: [
          "Transformer decoder 有多个层。后面的层通常在前面结果的基础上继续处理，能够得到更 refined 的定位。若只监督最后一层，中间层未必充分学会精确定位。",
          "GO-LSD（Global Optimal Localization Self-Distillation）的直觉是：让更优的定位结果作为一种内部教师，把定位知识传给较浅的预测层；同时让深层在更简单的残差修正任务上继续变准。",
          "这里的“蒸馏”不是引入一个外部大模型，而是模型内部不同深度之间的知识传递。它服务的不是分类知识，而是全局更优的定位信息。",
        ],
        takeaways: ["更深层预测可以提供更精确的定位信号", "GO-LSD 让浅层也学习更优定位知识", "这是模型内部的自蒸馏，而不是外部教师模型"],
        check: "为什么把更优层的定位信息传回前面，可能比只监督最后一层更有帮助？",
        terms: ["GO-LSD", "Self-distillation", "Deep Layer", "Shallow Layer", "Residual Refinement"],
      },
      {
        id: "whole-model",
        eyebrow: "THE WHOLE CHAIN",
        title: "把 D-FINE 从头到尾讲一遍",
        summary: "现在把所有部件串起来：图像、特征、查询、匹配、分布和细化，最终回到一个更准的框。",
        why: "真正学会的标志不是记住 FDR 和 GO-LSD，而是能解释它们在完整检测链中的位置和作用。",
        explain: [
          "输入图像首先经过 Backbone，变成多尺度视觉特征；Transformer 编码这些特征，让不同空间位置交流全局信息。Decoder 使用 object queries 读取图像 memory，每个 query 产生类别和定位相关表示。",
          "训练时，预测集合通过一对一匹配与真实目标建立对应关系，分类、框回归、辅助和去噪等目标共同提供学习信号。推理时，模型直接输出一组类别和边界框，通常不需要传统 NMS 作为核心去重步骤。",
          "D-FINE 的不同之处集中在定位：FDR 让边界回归进入细粒度分布 refinement 的表达，GO-LSD 让更优的定位知识在不同层之间传递。最终，它仍然要接受 IoU、AP 和真实失败案例的检验。",
        ],
        takeaways: ["D-FINE = DETR 的集合预测链 + 更细粒度的定位回归", "FDR 解决如何表达和细化位置", "GO-LSD 解决定位知识如何在层间传递"],
        check: "最后自测：你能否不用看缩写，解释 D-FINE 为什么可能改善小目标的定位精度？",
        terms: ["D-FINE", "FDR", "GO-LSD", "DETR", "Localization Precision"],
      },
    ],
  },
];

export const allLessons = chapters.flatMap((chapter) =>
  chapter.lessons.map((lesson) => ({ ...lesson, chapterId: chapter.id, chapterNumber: chapter.number, chapterTitle: chapter.title, color: chapter.color })),
);

export const glossary = [
  ["Feature Map", "卷积或 Backbone 产生的响应张量；每个通道记录一种学习出的模式响应。"],
  ["Object Query", "DETR Decoder 中可学习的目标级查询槽位，不是图像中的像素或真实框。"],
  ["Hungarian Matching", "在预测集合与真实目标集合之间寻找低代价一对一匹配的算法。"],
  ["FDR", "D-FINE 的 Fine-grained Distribution Refinement，把边界定位表示为可细化的分布过程。"],
  ["GO-LSD", "D-FINE 的 Global Optimal Localization Self-Distillation，让不同层共享更优的定位知识。"],
  ["AP50:95", "在多个 IoU 阈值上综合计算的 COCO 风格平均精度，不是置信度区间。"],
];
