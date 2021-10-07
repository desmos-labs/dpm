import {useCallback} from "react";
import RNFS from "react-native-fs"

const IPFS_URL = "https://ipfs.desmos.network"

export type IPFSResponse = {
    hash: string,
    name: string,
    size: number,
    url: string
}

/**
 * Hooks that provides a function to upload a picture to IPFS.
 */
export default function useUploadPicture(): (uriPath: string) => Promise<IPFSResponse> {
    return useCallback(async (path: string): Promise<IPFSResponse> => {
        const fileName = path.substring(path.lastIndexOf('/') + 1, path.length);
        const name = fileName.substring(0, fileName.lastIndexOf("."));
        const filePath = path.replace("file://", "");
        const type = path.substring(path.lastIndexOf(".") + 1, path.length);

        const file = {
            filename: fileName,
            name: name,
            filepath: filePath,
            filetype: `image/${type}`,
        }

        const response = await RNFS.uploadFiles({
            toUrl: `${IPFS_URL}/api/v0/add`,
            files: [file],
        }).promise

        const json = JSON.parse(response.body)
        if (json.Name !== undefined && json.Hash !== undefined && json.Size !== undefined) {
            return {
                name: json.Name,
                hash: json.Hash,
                size: parseInt(json.Size),
                url: `${IPFS_URL}/ipfs/${json.Hash}`
            }
        } else {
            throw new Error("Invalid response from server");
        }
    }, [])
}