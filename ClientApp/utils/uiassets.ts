const UIAssetsRoot = "/images/uiassets/";

export function getUIAssetUrl(assetName: string, variant?: string) {
    return UIAssetsRoot + assetName + (variant? '-' + variant : "") + '.svg';
}
