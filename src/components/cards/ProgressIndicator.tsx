import { Check, User, MessageSquare, Send } from 'lucide-react';
import { useForm } from './FormContext';

const steps = [
  {
    id: 1,
    name: 'Recipient',
    description: 'Basic info',
    icon: User,
  },
  {
    id: 2,
    name: 'Customize',
    description: 'Message & design',
    icon: MessageSquare,
  },
  {
    id: 3,
    name: 'Delivery',
    description: 'Send options',
    icon: Send,
  },
];

export default function ProgressIndicator() {
  const { currentStep, completedSteps } = useForm();

  const getStepStatus = (stepId: number) => {
    if (completedSteps.has(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white border-green-600';
      case 'current':
        return 'bg-purple-600 text-white border-purple-600';
      default:
        return 'bg-gray-100 text-gray-400 border-gray-300';
    }
  };

  const getConnectorClasses = (stepId: number) => {
    const isCompleted = completedSteps.has(stepId) || stepId < currentStep;
    return isCompleted ? 'bg-green-600' : 'bg-gray-300';
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition-all duration-200
                    ${getStepClasses(status)}
                  `}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Details - Hidden on mobile */}
                <div className="ml-4 hidden sm:block">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      status === 'upcoming' ? 'text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {step.name}
                  </p>
                  <p
                    className={`text-sm transition-colors ${
                      status === 'upcoming' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-12 lg:w-16 h-0.5 mx-4 transition-colors duration-200
                    ${getConnectorClasses(step.id)}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Details */}
      <div className="sm:hidden mt-4 text-center">
        {steps.map((step) => {
          if (step.id === currentStep) {
            return (
              <div key={step.id}>
                <p className="text-sm font-medium text-gray-900">{step.name}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
