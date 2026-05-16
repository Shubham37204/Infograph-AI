import { useMutation } from '@tanstack/react-query'
import { uploadResume } from '@/lib/api'
import { SlideDeckResponse } from '@/lib/types'
import { toast } from 'sonner'

export function usePipelineMutation() {
  return useMutation<SlideDeckResponse, Error, File>({
    mutationFn: uploadResume,
    onError: (error) => {
      toast.error('Analysis failed', {
        description: error.message || 'There was an error analyzing the resume.',
      })
    },
  })
}
