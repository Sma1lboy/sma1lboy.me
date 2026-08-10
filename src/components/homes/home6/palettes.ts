/**
 * Home6 的配色。定稿:PHANTOM —— 酒红 + 酸性黄。
 *
 * 之前并存过四套(电紫/靛蓝/深紫/酒红)靠 ?p= 切换来当面比,定了之后砍成一套。
 * 保留 Palette 类型和单例结构,而不是把颜色散进组件:换色只动这一个文件。
 *
 * 层级是固定的,换色时明度关系必须守住,否则对比度会塌:
 *   ink    最深,页面兜底 / 图上压字
 *   wine   主底
 *   blood  大色块
 *   accent 结构性亮线(分节线、标题投影)
 *   violet 次要色块
 *   amp    唯一的行动色,只给可点的东西
 *   bone   正文
 */

export interface Palette {
  ink: string;
  wine: string;
  blood: string;
  accent: string;
  violet: string;
  amp: string;
  bone: string;
  /** shader 底噪的两个辉光色 */
  glowA: string;
  glowB: string;
  /** 海报目录:public/images/shots/<shots>/ */
  shots: string;
}

export const PHANTOM: Palette = {
  ink: "#160309",
  wine: "#3d0a1e",
  blood: "#8b0f2a",
  accent: "#e01a3c",
  violet: "#2e0b42",
  amp: "#ffd400",
  bone: "#f7f2e8",
  glowA: "#8b0f2a",
  glowB: "#ffd400",
  shots: "phantom",
};
