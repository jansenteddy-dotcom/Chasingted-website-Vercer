import React, {useCallback, useRef, useState} from 'react'
import {useClient, set} from 'sanity'
import type {ArrayOfObjectsInputProps} from 'sanity'

export function MultiImageUpload(props: ArrayOfObjectsInputProps) {
  const client = useClient({apiVersion: '2024-06-01'})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')

  const handleFiles = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])
      if (!files.length) return
      setUploading(true)
      setProgress(`Uploading 0 / ${files.length}…`)

      try {
        const uploaded: {_id: string}[] = []
        for (let i = 0; i < files.length; i++) {
          const asset = await (client.assets.upload as any)('image', files[i], {filename: files[i].name})
          uploaded.push(asset)
          setProgress(`Uploading ${i + 1} / ${files.length}…`)
        }

        const newItems = uploaded.map((asset) => ({
          _type: 'image' as const,
          _key: Math.random().toString(36).slice(2, 11),
          asset: {_type: 'reference' as const, _ref: asset._id},
        }))

        const existing = Array.isArray(props.value) ? props.value : []
        props.onChange(set([...existing, ...newItems]))
      } catch (err) {
        console.error('Upload failed', err)
        setProgress('Upload failed — please try again.')
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
        setTimeout(() => setProgress(''), 3000)
      }
    },
    [client, props],
  )

  return (
    <div>
      {props.renderDefault(props)}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{display: 'none'}}
        onChange={handleFiles}
      />

      <div style={{marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '8px 16px',
            backgroundColor: uploading ? '#999' : '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {uploading ? 'Uploading…' : '⬆ Upload Multiple Photos'}
        </button>
        {progress && (
          <span style={{fontSize: '13px', color: '#555'}}>{progress}</span>
        )}
      </div>
    </div>
  )
}
